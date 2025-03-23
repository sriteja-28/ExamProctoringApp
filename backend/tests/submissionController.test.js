const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const { Exam, ExamAttempt, Category } = require('../models');

const token = jwt.sign({ id: 1, role: 'SUPER_ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Exam API Endpoints', () => {
  let category;

  beforeEach(async () => {
    await Exam.destroy({ where: {} });
    if (ExamAttempt) await ExamAttempt.destroy({ where: {} });
    await Category.destroy({ where: {} });
    category = await Category.create({ name: 'Test Category' });
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
      // Include all required fields when creating ExamAttempt.
      await ExamAttempt.create({
        examId: exam.id,
        userId: 2,
        score: 80,
        totalScore: 100,
        attemptDate: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        status: 'completed'  // Added additional required field
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
        userId: 2,
        score: 80,
        totalScore: 100,
        attemptDate: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        status: 'completed'  // Added additional required field
      });
      
      const res = await request(app)
        .get('/api/superadmin/exam-attempts/2')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach(attempt => {
        expect(attempt.userId).toBe(2);
      });
    });
  });
});
