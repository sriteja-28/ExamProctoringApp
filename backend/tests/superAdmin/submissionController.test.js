// tests/submissionController.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../../server'); // Adjust path if needed
const { ExamAttempt, User, Exam, Category } = require('../../models');

// Generate a valid token for SUPER_ADMIN.
const token = jwt.sign({ id: 1, role: 'SUPER_ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Submission Controller Endpoints', () => {
  let category, dummyUser;

  beforeEach(async () => {
    await Exam.destroy({ where: {} });
    if (ExamAttempt) await ExamAttempt.destroy({ where: {} });
    await Category.destroy({ where: {} });
    // Create a category and dummy user for exam attempts.
    category = await Category.create({ name: 'Dummy Category' });
    dummyUser = await User.create({
      email: 'dummy2@example.com',
      password: 'dummy123',
      isActive: true,
      role: 'USER'
    });
  });

  afterEach(async () => {
    await User.destroy({ where: { email: 'dummy2@example.com' } });
  });
describe('GET /api/superadmin/test-submissions', () => {
    it('should retrieve test submissions with associated User and Exam', async () => {
      
      const exam = await Exam.create({
        name: 'Final Exam',
        description: 'Final exam description',
        categoryId: category.id,
        duration: 60,
        date: new Date().toISOString(),
        numberOfSets: 2,
        questionsPerSet: 10,
        totalScore:10
      });
      await ExamAttempt.create({
        examId: exam.id,
        userId: dummyUser.id,
        score: 80,
        status: 'COMPLETED'
      });
      
      const res = await request(app)
        .get('/api/superadmin/test-submissions')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Check that associated User and Exam data are present.
      const submission = res.body[0];
      expect(submission).toHaveProperty('User');
      expect(submission.User).toHaveProperty('id', dummyUser.id);
      expect(submission).toHaveProperty('Exam');
      expect(submission.Exam).toHaveProperty('name', 'Final Exam');
    });
  });
});
