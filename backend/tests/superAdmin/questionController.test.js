const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../../server');
const { Question, Category } = require('../../models');
const token = jwt.sign({ id: 1, role: 'SUPER_ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Question API Endpoints', () => {
  let category;

  beforeEach(async () => {
    await Question.destroy({ where: {} });
    await Category.destroy({ where: {} });
    category = await Category.create({ name: 'Test Category' });
  });

  describe('GET /api/superadmin/questions/:categoryId', () => {
    it('should list all questions for a valid category', async () => {
      await Question.create({
        text: 'What is Node.js?',
        optionA: 'JavaScript runtime',
        optionB: 'Programming language',
        optionC: 'Database',
        optionD: 'Framework',
        correctOption: 'A',
        categoryId: category.id
      });
      await Question.create({
        text: 'What is Express?',
        optionA: 'Library',
        optionB: 'Framework',
        optionC: 'Runtime',
        optionD: 'Database',
        correctOption: 'B',
        categoryId: category.id
      });
      const res = await request(app)
        .get(`/api/superadmin/questions/${category.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should return 400 for invalid category ID', async () => {
      const res = await request(app)
        .get('/api/superadmin/questions/invalid')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid category ID');
    });
  });

  describe('POST /api/superadmin/questions', () => {
    it('should create a new question', async () => {
      const questionData = {
        text: 'What is JavaScript?',
        optionA: 'A programming language',
        optionB: 'A framework',
        optionC: 'A database',
        optionD: 'None of the above',
        correctOption: 'A',
        categoryId: category.id
      };
      const res = await request(app)
        .post('/api/superadmin/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(questionData);
      expect(res.status).toBe(201);
      expect(res.body.text).toBe('What is JavaScript?');
    });

    it('should return 400 for missing required fields', async () => {
      const questionData = {
        text: 'Incomplete question',
        optionA: 'A'
      };
      const res = await request(app)
        .post('/api/superadmin/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(questionData);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing required fields');
    });

    it("should return 400 if correctOption is invalid", async () => {
      const questionData = {
        text: 'Invalid correct option question',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        correctOption: 'E',
        categoryId: category.id
      };
      const res = await request(app)
        .post('/api/superadmin/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(questionData);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("correctOption must be 'A', 'B', 'C', or 'D'");
    });

    it("should return 400 if category does not exist", async () => {
      const questionData = {
        text: 'Non-existent category question',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        correctOption: 'A',
        categoryId: 9999 
      };
      const res = await request(app)
        .post('/api/superadmin/questions')
        .set('Authorization', `Bearer ${token}`)
        .send(questionData);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Category does not exist');
    });
  });

  describe('PUT /api/superadmin/questions/:id', () => {
    it('should update an existing question', async () => {
      const questionData = {
        text: 'Original question text',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        correctOption: 'A',
        categoryId: category.id
      };
      const createdQuestion = await Question.create(questionData);
      const updatedData = {
        text: 'Updated question text',
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D',
        correctOption: 'B',
        categoryId: category.id
      };
      const res = await request(app)
        .put(`/api/superadmin/questions/${createdQuestion.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Question updated successfully');
      expect(res.body.question.text).toBe('Updated question text');
    });

    it('should return 404 if question not found', async () => {
      const updatedData = {
        text: 'Updated question text',
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D',
        correctOption: 'B',
        categoryId: category.id
      };
      const res = await request(app)
        .put('/api/superadmin/questions/9999')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Question not found');
    });
  });

  describe('DELETE /api/superadmin/questions/:id', () => {
    it('should delete a question', async () => {
      const questionData = {
        text: 'Question to delete',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        correctOption: 'A',
        categoryId: category.id
      };
      const createdQuestion = await Question.create(questionData);
      const res = await request(app)
        .delete(`/api/superadmin/questions/${createdQuestion.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Question deleted successfully');
    });

    it('should return 404 if question does not exist', async () => {
      const res = await request(app)
        .delete('/api/superadmin/questions/9999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Question not found');
    });
  });

  describe('DELETE /api/superadmin/questions/category/:categoryId', () => {
    it('should delete all questions for a given category', async () => {
      await Question.create({
        text: 'Question 1',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        correctOption: 'A',
        categoryId: category.id
      });
      await Question.create({
        text: 'Question 2',
        optionA: 'A',
        optionB: 'B',
        optionC: 'C',
        optionD: 'D',
        correctOption: 'B',
        categoryId: category.id
      });
      const res = await request(app)
        .delete(`/api/superadmin/questions/category/${category.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('All questions deleted successfully for this category');
    });

    it('should return 400 for invalid category ID', async () => {
      const res = await request(app)
        .delete('/api/superadmin/questions/category/invalid')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid category ID');
    });
  });

  describe('POST /api/superadmin/questions/bulk', () => {
    it('should bulk create questions', async () => {
      const questions = [
        {
          text: 'Bulk Question 1?',
          optionA: 'A',
          optionB: 'B',
          optionC: 'C',
          optionD: 'D',
          correctOption: 'A',
          categoryId: category.id
        },
        {
          text: 'Bulk Question 2?',
          optionA: 'A',
          optionB: 'B',
          optionC: 'C',
          optionD: 'D',
          correctOption: 'B',
          categoryId: category.id
        },
        {
          text: 'Bulk Question 1?',
          optionA: 'A',
          optionB: 'B',
          optionC: 'C',
          optionD: 'D',
          correctOption: 'A',
          categoryId: category.id
        }
      ];
      const res = await request(app)
        .post('/api/superadmin/questions/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({ questions });
      expect(res.status).toBe(201);
      expect(res.body.length).toBe(2);
    });

    it('should return 400 if questions data is invalid', async () => {
      const res = await request(app)
        .post('/api/superadmin/questions/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({ questions: [] });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid data. Expected an array of questions.');
    });
  });
});
