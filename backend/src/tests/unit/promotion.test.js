const { testConfig, sequelize } = require('../setup');
const request = require('supertest');
const app = require('../../app');
const { Promotion, Product, User, PromotionTemplate } = require('../../models');

describe('Promotion API Tests', () => {
  let token;
  let testProduct;
  let testUser;
  let testTemplate;

  // Test data
  const testPromotion = {
    name: 'Test Promotion',
    description: 'Test Description',
    discount_type: 'percentage',
    discount_value: 20,
    start_date: new Date(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    min_purchase_amount: 100,
    max_discount_amount: 50,
    is_active: true
  };

  beforeEach(async () => {
    // Create test user and get token
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin'
    });

    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    token = loginResponse.body.token;

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      sku: 'TEST-001',
      stock_quantity: 100
    });

    // Create test template
    testTemplate = await PromotionTemplate.create({
      name: 'Test Template',
      description: 'Test Template Description',
      discount_type: 'percentage',
      discount_value: 20,
      conditions: { min_purchase: 100 }
    });
  });

  describe('POST /api/promotions', () => {
    it('should create a new promotion', async () => {
      const response = await request(app)
        .post('/api/promotions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testPromotion,
          template_id: testTemplate.id,
          product_ids: [testProduct.id]
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testPromotion.name);
      expect(response.body.template_id).toBe(testTemplate.id);
      expect(response.body.products).toHaveLength(1);
    });

    it('should not create promotion without required fields', async () => {
      const response = await request(app)
        .post('/api/promotions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Missing required fields'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/promotions', () => {
    beforeEach(async () => {
      // Create test promotion
      await Promotion.create({
        ...testPromotion,
        template_id: testTemplate.id
      });
    });

    it('should get all promotions', async () => {
      const response = await request(app)
        .get('/api/promotions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter promotions by status', async () => {
      const response = await request(app)
        .get('/api/promotions')
        .set('Authorization', `Bearer ${token}`)
        .query({ is_active: true });

      expect(response.status).toBe(200);
      expect(response.body.every(p => p.is_active === true)).toBe(true);
    });
  });

  describe('GET /api/promotions/:id', () => {
    let promotionId;

    beforeEach(async () => {
      const promotion = await Promotion.create({
        ...testPromotion,
        template_id: testTemplate.id
      });
      promotionId = promotion.id;
    });

    it('should get promotion by id', async () => {
      const response = await request(app)
        .get(`/api/promotions/${promotionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(promotionId);
      expect(response.body.name).toBe(testPromotion.name);
    });

    it('should return 404 for non-existent promotion', async () => {
      const response = await request(app)
        .get('/api/promotions/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/promotions/:id', () => {
    let promotionId;

    beforeEach(async () => {
      const promotion = await Promotion.create({
        ...testPromotion,
        template_id: testTemplate.id
      });
      promotionId = promotion.id;
    });

    it('should update promotion', async () => {
      const updatedData = {
        name: 'Updated Promotion',
        discount_value: 30
      };

      const response = await request(app)
        .put(`/api/promotions/${promotionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.discount_value).toBe(updatedData.discount_value);
    });
  });

  describe('DELETE /api/promotions/:id', () => {
    let promotionId;

    beforeEach(async () => {
      const promotion = await Promotion.create({
        ...testPromotion,
        template_id: testTemplate.id
      });
      promotionId = promotion.id;
    });

    it('should delete promotion', async () => {
      const response = await request(app)
        .delete(`/api/promotions/${promotionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      // Verify promotion is deleted
      const deletedPromotion = await Promotion.findByPk(promotionId);
      expect(deletedPromotion).toBeNull();
    });
  });

  describe('POST /api/promotions/:id/schedule', () => {
    let promotionId;

    beforeEach(async () => {
      const promotion = await Promotion.create({
        ...testPromotion,
        template_id: testTemplate.id
      });
      promotionId = promotion.id;
    });

    it('should schedule promotion', async () => {
      const scheduleData = {
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        recurrence: 'daily'
      };

      const response = await request(app)
        .post(`/api/promotions/${promotionId}/schedule`)
        .set('Authorization', `Bearer ${token}`)
        .send(scheduleData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('schedule_id');
    });
  });
}); 