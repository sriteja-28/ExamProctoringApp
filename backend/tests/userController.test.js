const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../server'); 
const { ExamAttempt, Exam, Category, User } = require('../models');

describe('GET /submissions (User Exam Submissions)', () => {
  let dummyUser, token, category, exam;

  beforeEach(async () => {

    await ExamAttempt.destroy({ where: {} });
    await Exam.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await User.destroy({ where: { email: 'dummy@example.com' } });
    
    category = await Category.create({ name: 'Test Category' });
    
    
    dummyUser = await User.create({
      email: 'dummy@example.com',
      password: 'password123',
      isActive: true,
      role: 'USER'
    });
    
    token = jwt.sign({ id: dummyUser.id, role: dummyUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    

    exam = await Exam.create({
      name: 'Test Exam',
      totalScore: 100,
      categoryId: category.id,
      duration: 60,                         
      date: new Date().toISOString(),       
      numberOfSets: 2,                      
      questionsPerSet: 5                    
    });
  });

  afterEach(async () => {
    await User.destroy({ where: { email: 'dummy@example.com' } });
  });

  it('should return only exam attempts with status not equal to PENDING, including associated Exam details', async () => {

    await ExamAttempt.create({
      examId: exam.id,
      userId: dummyUser.id,
      score: 80,
      status: 'COMPLETED'
    });
    await ExamAttempt.create({
      examId: exam.id,
      userId: dummyUser.id,
      score: 0,
      status: 'CANCELLED'
    });
    await ExamAttempt.create({
      examId: exam.id,
      userId: dummyUser.id,
      score: 0,
      status: 'PENDING'
    });
    const res = await request(app)
      .get('/api/user/submissions')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);

    res.body.forEach(attempt => {
      expect(attempt.status).not.toBe('PENDING');
      expect(attempt).toHaveProperty('Exam');
      expect(attempt.Exam).toHaveProperty('name');
      expect(attempt.Exam).toHaveProperty('totalScore');
    });
  });
});
