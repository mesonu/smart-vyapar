const { testConfig, sequelize } = require('../setup');
const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models');

describe('User API Tests', () => {
  // Test data
  const testUser = {
    "name": "testing",
    "email": new Date()+"@email.com",
    "phone":"9634634631",
    "password":"123456",
    "businessName":"testing",
    "businessType":"kirana",
    "gstNumber":"",
    "address":"Delhi"
  };

  describe('POST /api/users/register', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.password).toBeUndefined(); // Password should not be returned
    });

    it('should not create user with duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/users/register')
        .send(testUser);

      // Try to create user with same email
      const response = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/users/register')
        .send(testUser);
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/profile', () => {
    let token;

    beforeEach(async () => {
      // Register and login to get token
      await request(app)
        .post('/api/users/register')
        .send(testUser);

      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      token = loginResponse.body.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.password).toBeUndefined();
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
    });
  });
}); 