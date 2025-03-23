const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const { Category, Question, Exam } = require('../models');


const token = jwt.sign({ id: 1, role: 'SUPER_ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Category API Endpoints', () => {
  beforeEach(async () => {
    await Question.destroy({ where: {} });
    await Exam.destroy({ where: {} });
    await Category.destroy({ where: {} });
  });

  describe('POST /api/superadmin/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/superadmin/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Math' });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Math');
    });

    it('should return error for duplicate category', async () => {
      await Category.create({ name: 'Science' });
      const res = await request(app)
        .post('/api/superadmin/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Science' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Category already exists');
    });
  });

  describe('GET /api/superadmin/categories', () => {
    it('should list all categories with totalQuestions count', async () => {
      const cat = await Category.create({ name: 'History' });
      await Question.create({
        text: 'What is WWII?',
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D',
        correctOption: 'A',
        categoryId: cat.id,
      });

      const res = await request(app)
        .get('/api/superadmin/categories')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const category = res.body.find(c => c.name === 'History');
      expect(category).toHaveProperty('totalQuestions');
      expect(Number(category.totalQuestions)).toBe(1);
    });
  });

  describe('PUT /api/superadmin/categories/:id', () => {
    it('should update a category name', async () => {
      const cat = await Category.create({ name: 'Geography' });
      const res = await request(app)
        .put(`/api/superadmin/categories/${cat.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'World Geography' });
      expect(res.status).toBe(200);
      expect(res.body.category.name).toBe('World Geography');
    });

    it('should return error if new name is same as before', async () => {
      const cat = await Category.create({ name: 'Physics' });
      const res = await request(app)
        .put(`/api/superadmin/categories/${cat.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Physics' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Category name is the same as before');
    });

    it('should return error if new name already exists', async () => {
      await Category.create({ name: 'Chemistry' });
      const cat2 = await Category.create({ name: 'Biology' });
      const res = await request(app)
        .put(`/api/superadmin/categories/${cat2.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Chemistry' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Category name already exists');
    });
  });

  describe('DELETE /api/superadmin/categories/:id', () => {
    it('should delete a category if it has no related questions or exams', async () => {
      const cat = await Category.create({ name: 'Art' });
      const res = await request(app)
        .delete(`/api/superadmin/categories/${cat.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Category deleted successfully');
    });

    it('should return error if category is used in questions or exams', async () => {
      const cat = await Category.create({ name: 'Music' });
      await Question.create({
        text: 'Who composed the 5th symphony?',
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D',
        correctOption: 'A',
        categoryId: cat.id,
      });
      const res = await request(app)
        .delete(`/api/superadmin/categories/${cat.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Cannot delete category; it is used in other records.');
    });
  });
});
