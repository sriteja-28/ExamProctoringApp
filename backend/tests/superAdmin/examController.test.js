// tests/saExamController.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../../server'); // Adjust path if necessary
const { Exam, ExamAttempt, Category, Question, User } = require('../../models');

const token = jwt.sign({ id: 1, role: 'SUPER_ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Exam API Endpoints', () => {
  let category;
  let dummyUser; // For exam attempts

  beforeEach(async () => {
    // Clean up exams, exam attempts, categories, and dummy user
    await Exam.destroy({ where: {} });
    if (ExamAttempt) await ExamAttempt.destroy({ where: {} });
    await Category.destroy({ where: {} });
    // Create a category for exams
    category = await Category.create({ name: 'Test Category' });
    // Create a dummy user for exam attempts
    dummyUser = await User.create({
      email: 'dummy@example.com',
      password: 'dummy123',
      isActive: true,
      role: 'USER'
    });
  });

  afterEach(async () => {
    // Clean up dummy user after each test
    await User.destroy({ where: { email: 'dummy@example.com' } });
  });

  describe('POST /api/superadmin/exams', () => {
    it('should create a new exam', async () => {
      // Create enough questions for exam creation.
      for (let i = 0; i < 30; i++) {
        await Question.create({
          text: `Question ${i + 1}?`,
          optionA: 'A',
          optionB: 'B',
          optionC: 'C',
          optionD: 'D',
          correctOption: 'A',
          categoryId: category.id
        });
      }
  
      const examData = {
        name: 'Midterm Exam',
        description: 'Exam for midterm assessments',
        categoryId: category.id,
        duration: 90,
        date: new Date().toISOString(),
        numberOfSets: 3,
        questionsPerSet: 10
      };
  
      const res = await request(app)
        .post('/api/superadmin/exams')
        .set('Authorization', `Bearer ${token}`)
        .send(examData);
      
      expect(res.status).toBe(201);
      expect(res.body.exam.name).toBe('Midterm Exam');
    });
  });
  
  describe('GET /api/superadmin/exams', () => {
    it('should list all exams', async () => {
      await Exam.create({ 
        name: 'Exam 1', 
        description: 'Description 1', 
        categoryId: category.id,
        duration: 60,
        date: new Date().toISOString(),
        numberOfSets: 2,
        questionsPerSet: 5
      });
      await Exam.create({ 
        name: 'Exam 2', 
        description: 'Description 2', 
        categoryId: category.id,
        duration: 90,
        date: new Date().toISOString(),
        numberOfSets: 3,
        questionsPerSet: 10
      });
      
      const res = await request(app)
        .get('/api/superadmin/exams')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });
  
  describe('PUT /api/superadmin/exams/:id', () => {
    it('should update an exam', async () => {
      const exam = await Exam.create({ 
        name: 'Exam Old', 
        description: 'Old Description', 
        categoryId: category.id,
        duration: 60,
        date: new Date().toISOString(),
        numberOfSets: 2,
        questionsPerSet: 5
      });
      const updatedData = { 
        name: 'Exam Updated', 
        description: 'New Description',
        duration: 120,             
        date: new Date().toISOString(),
        numberOfSets: 4,
        questionsPerSet: 15
      };
      
      const res = await request(app)
        .put(`/api/superadmin/exams/${exam.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);
      
      expect(res.status).toBe(200);
      expect(res.body.exam.name).toBe('Exam Updated');
    });
  });
  
  describe('DELETE /api/superadmin/exams/:id', () => {
    it('should delete an exam', async () => {
      const exam = await Exam.create({ 
        name: 'Exam To Delete', 
        description: 'To be removed', 
        categoryId: category.id,
        duration: 60,
        date: new Date().toISOString(),
        numberOfSets: 2,
        questionsPerSet: 5
      });
      
      const res = await request(app)
        .delete(`/api/superadmin/exams/${exam.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Exam deleted successfully');
    });
  });
  
  describe('GET /api/superadmin/exam-attempts', () => {
    it('should retrieve all exam attempts', async () => {
      const exam = await Exam.create({ 
        name: 'Exam for Attempt', 
        description: 'Attempt exam', 
        categoryId: category.id,
        duration: 60,
        date: new Date().toISOString(),
        numberOfSets: 2,
        questionsPerSet: 5
      });
      // Create an exam attempt using allowed fields.
      await ExamAttempt.create({
        examId: exam.id,
        userId: dummyUser.id,
        score: 80,
        status: 'COMPLETED'
      });
      
      const res = await request(app)
        .get('/api/superadmin/exam-attempts')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
  
  describe('GET /api/superadmin/exam-attempts/:userId', () => {
    it('should retrieve exam attempts for a specific user', async () => {
      const exam = await Exam.create({ 
        name: 'Exam for Specific Attempt', 
        description: 'Attempt exam', 
        categoryId: category.id,
        duration: 60,
        date: new Date().toISOString(),
        numberOfSets: 2,
        questionsPerSet: 5
      });
      await ExamAttempt.create({
        examId: exam.id,
        userId: dummyUser.id,
        score: 80,
        status: 'COMPLETED'
      });
      
      const res = await request(app)
        .get(`/api/superadmin/exam-attempts/${dummyUser.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach(attempt => {
        expect(attempt.userId).toBe(dummyUser.id);
      });
    });
  });
});
