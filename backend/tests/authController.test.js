const request = require('supertest');
const { app } = require('../server');
const { User } = require('../models');

let server;

beforeAll(done => {
  server = app.listen(0, done);
});

beforeAll(async () => {
  await User.destroy({ where: { email: "test@example.com" } });
  await User.create({
    email: "test@example.com",
    password: "password123",
    isActive: true,
  });
});

describe("Auth Endpoints", () => {
  it("should login a user with valid credentials", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should fail login with invalid credentials", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });
    
    expect(res.statusCode).toBe(401);
  });
});

afterAll(done => {
  server.close(done);
});
