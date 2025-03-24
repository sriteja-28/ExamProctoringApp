// tests/examController.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../server'); // Adjust path if needed
const { Exam, ExamAttempt, Question, Category, User } = require('../models');

describe('User Exam Endpoints', () => {
  let category, exam, dummyUser, tokenUser;

  beforeEach(async () => {
    // Clean up previous test data
    await Exam.destroy({ where: {} });
    await ExamAttempt.destroy({ where: {} });
    await Question.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await User.destroy({ where: { email: 'dummy@example.com' } });
    
    // Create a category
    category = await Category.create({ name: 'Test Category' });
    
    // Create a dummy user (exam taker)
    dummyUser = await User.create({
      email: 'dummy@example.com',
      password: 'password123',
      isActive: true,
      role: 'USER'
    });
    tokenUser = jwt.sign({ id: dummyUser.id, role: dummyUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Create an exam for testing. For startExam test, we need the exam date to be in the past but within the start window.
    // Here we set exam.date to 5 minutes ago.
    exam = await Exam.create({
      name: 'Sample Exam',
      description: 'An exam for testing user endpoints',
      categoryId: category.id,
      duration: 60,
      date: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      numberOfSets: 2,
      questionsPerSet: 5
    });
  });

  afterEach(async () => {
    // Clean up dummy user
    await User.destroy({ where: { email: 'dummy@example.com' } });
  });

  // ---------------- getExams ----------------
  describe('GET /api/exams', () => {
    it('should fetch all exams with associated category name', async () => {
      const res = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length) {
        expect(res.body[0]).toHaveProperty('Category');
        expect(res.body[0].Category).toHaveProperty('name', category.name);
      }
    });
  });

  // ---------------- getExamById ----------------
  describe('GET /api/exams/:id', () => {
    it('should fetch exam details with a shuffled questionSet', async () => {
      // Create 10 questions for this exam.
      for (let i = 0; i < 10; i++) {
        await Question.create({
          text: `Question ${i + 1}?`,
          optionA: 'A',
          optionB: 'B',
          optionC: 'C',
          optionD: 'D',
          correctOption: 'A',
          categoryId: category.id,
          // Optionally, if your association supports linking examId:
          examId: exam.id
        });
      }
      const res = await request(app)
        .get(`/api/exams/${exam.id}`)
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(200);
      // The response should have a "questionSet" property (shuffled & limited)
      expect(res.body).toHaveProperty('questionSet');
      expect(Array.isArray(res.body.questionSet)).toBe(true);
      expect(res.body.questionSet.length).toBeLessThanOrEqual(exam.questionsPerSet);
      // And the original "questions" property is removed.
      expect(res.body).not.toHaveProperty('questions');
    });

    it('should return 404 for a non-existent exam', async () => {
      const res = await request(app)
        .get('/api/exams/99999')
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Exam not found');
    });
  });

  // ---------------- startExam ----------------
  describe('POST /api/exams/:id/start', () => {
    it('should start an exam if within the allowed start window and no prior attempt exists', async () => {
      const res = await request(app)
        .post(`/api/exams/${exam.id}/start`)
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Exam started successfully');
      expect(res.body).toHaveProperty('attempt');
      expect(res.body.attempt.status).toBe('PENDING');
    });

    it("should not start the exam if it hasn't started yet", async () => {
      // Create an exam that is scheduled to start in the future.
      const futureExam = await Exam.create({
        name: 'Future Exam',
        description: 'Exam not started yet',
        categoryId: category.id,
        duration: 60,
        date: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes in the future
        numberOfSets: 2,
        questionsPerSet: 5
      });
      const res = await request(app)
        .post(`/api/exams/${futureExam.id}/start`)
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', "Exam hasn't started yet. Please wait for the scheduled time.");
    });

    it("should not allow starting the exam if the start window has expired", async () => {
      // Create an exam with a start time long past (e.g., 30 minutes ago with a 20-minute window).
      const oldExam = await Exam.create({
        name: 'Old Exam',
        description: 'Start window expired',
        categoryId: category.id,
        duration: 60,
        date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        numberOfSets: 2,
        questionsPerSet: 5
      });
      const res = await request(app)
        .post(`/api/exams/${oldExam.id}/start`)
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', "Exam start window has expired. You cannot start the exam.");
    });
  });

  // ---------------- submitExam ----------------
  describe('POST /api/exams/:id/submit', () => {
    let examAttempt, questions;
    beforeEach(async () => {
      // Create a pending exam attempt.
      examAttempt = await ExamAttempt.create({
        examId: exam.id,
        userId: dummyUser.id,
        status: 'PENDING',
        score: 0,
        answers: {}
      });
      // Create 5 questions with correct answer 'A'
      questions = [];
      for (let i = 1; i <= 5; i++) {
        const q = await Question.create({
          text: `Question ${i}?`,
          optionA: 'A',
          optionB: 'B',
          optionC: 'C',
          optionD: 'D',
          correctOption: 'A',
          categoryId: category.id,
          examId: exam.id
        });
        questions.push(q);
      }
    });

    it('should submit the exam, calculate the correct score, and mark attempt as COMPLETED', async () => {
      // Prepare answers: all correct.
      const answers = {};
      questions.forEach(q => {
        answers[q.id] = 'A';
      });
      const res = await request(app)
        .post(`/api/exams/${exam.id}/submit`)
        .set('Authorization', `Bearer ${tokenUser}`)
        .send({ answers });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Exam submitted successfully');
      expect(res.body).toHaveProperty('attempt');
      expect(res.body.attempt.status).toBe('COMPLETED');
      expect(res.body.attempt.score).toBe(5);
    });

    it('should return 404 if exam attempt is not found', async () => {
      // Remove the exam attempt.
      await ExamAttempt.destroy({ where: { examId: exam.id, userId: dummyUser.id } });
      const res = await request(app)
        .post(`/api/exams/${exam.id}/submit`)
        .set('Authorization', `Bearer ${tokenUser}`)
        .send({ answers: {} });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Exam attempt not found');
    });

    it('should not allow resubmission if the exam is already submitted', async () => {
      await examAttempt.update({ status: 'COMPLETED' });
      const res = await request(app)
        .post(`/api/exams/${exam.id}/submit`)
        .set('Authorization', `Bearer ${tokenUser}`)
        .send({ answers: {} });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'You have already submitted this exam. Multiple submissions are not allowed.');
    });
  });

  // ---------------- cancelExam ----------------
  describe('POST /api/exams/:id/cancel', () => {
    let examAttempt;
    beforeEach(async () => {
      examAttempt = await ExamAttempt.create({
        examId: exam.id,
        userId: dummyUser.id,
        status: 'PENDING',
        score: 0,
        answers: {}
      });
    });

    it('should cancel a pending exam attempt', async () => {
      const res = await request(app)
        .post(`/api/exams/${exam.id}/cancel`)
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Exam cancelled successfully');
      expect(res.body.attempt.status).toBe('CANCELLED');
    });

    it('should not allow cancelling a completed exam', async () => {
      await examAttempt.update({ status: 'COMPLETED' });
      const res = await request(app)
        .post(`/api/exams/${exam.id}/cancel`)
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'You cannot cancel a completed exam.');
    });

    it('should not allow cancelling an already cancelled exam', async () => {
      await examAttempt.update({ status: 'CANCELLED' });
      const res = await request(app)
        .post(`/api/exams/${exam.id}/cancel`)
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'Exam is already cancelled.');
    });
  });

  // ---------------- getUserAttempts ----------------
  describe('GET /api/exams/attempts/:userId', () => {
    it('should return 404 if no exam attempts are found for the user', async () => {
      const res = await request(app)
        .get(`/api/exams/attempts/${dummyUser.id}`)
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'No exam attempts found for this user');
    });

    it('should retrieve exam attempts for the user', async () => {
      await ExamAttempt.create({
        examId: exam.id,
        userId: dummyUser.id,
        status: 'COMPLETED',
        score: 3,
        answers: {}
      });
      await ExamAttempt.create({
        examId: exam.id,
        userId: dummyUser.id,
        status: 'PENDING',
        score: 0,
        answers: {}
      });
      const res = await request(app)
        .get(`/api/exams/attempts/${dummyUser.id}`)
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });
});
