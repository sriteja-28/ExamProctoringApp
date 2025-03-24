const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../server'); 
const { User } = require('../models');

describe('Admin Controller Endpoints - Self Role Update Restrictions', () => {
  let adminUser;
  let tokenAdmin; 

  beforeEach(async () => {
    await User.destroy({ where: { email: 'admin@example.com' } });
    adminUser = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      isActive: true,
      role: 'ADMIN'
    });
    tokenAdmin = jwt.sign({ id: adminUser.id, role: adminUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(async () => {
    await User.destroy({ where: { email: 'admin@example.com' } });
  });

  describe('PATCH /api/admin/users/:id/role (self-update)', () => {
    it('should reject an admin updating his own role to USER', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${adminUser.id}/role`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ role: 'USER' });
      
      
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Admin cannot change his own role');
      
      
      const updatedUser = await User.findByPk(adminUser.id);
      expect(updatedUser.role).toBe('ADMIN');
    });

    it('should reject an admin updating his own role to SUPER_ADMIN', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${adminUser.id}/role`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ role: 'SUPER_ADMIN' });
      
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Admin cannot change his own role');
      
      const updatedUser = await User.findByPk(adminUser.id);
      expect(updatedUser.role).toBe('ADMIN');
    });
  });
});
