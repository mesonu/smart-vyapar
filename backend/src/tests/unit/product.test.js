const { testConfig, sequelize } = require('../setup');
const request = require('supertest');
const app = require('../../app');
const { Product, Category, Tag, User } = require('../../models');

describe('Product API Tests', () => {
  let token;
  let testCategory;
  let testTag;

  // Test data
  const testProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    sku: 'TEST-001',
    stock_quantity: 100
  };

  beforeEach(async () => {
    // Create test user and get token
    const user = await User.create({
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

    // Create test category
    testCategory = await Category.create({
      name: 'Test Category',
      description: 'Test Category Description'
    });

    // Create test tag
    testTag = await Tag.create({
      name: 'Test Tag',
      description: 'Test Tag Description'
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testProduct,
          category_id: testCategory.id,
          tag_ids: [testTag.id]
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testProduct.name);
      expect(response.body.category_id).toBe(testCategory.id);
    });

    it('should not create product without required fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Missing required fields'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Create test products
      await Product.create({
        ...testProduct,
        category_id: testCategory.id
      });
    });

    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .query({ category_id: testCategory.id });

      expect(response.status).toBe(200);
      expect(response.body.every(p => p.category_id === testCategory.id)).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        ...testProduct,
        category_id: testCategory.id
      });
      productId = product.id;
    });

    it('should get product by id', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe(testProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        ...testProduct,
        category_id: testCategory.id
      });
      productId = product.id;
    });

    it('should update product', async () => {
      const updatedData = {
        name: 'Updated Product',
        price: 149.99
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.price).toBe(updatedData.price);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        ...testProduct,
        category_id: testCategory.id
      });
      productId = product.id;
    });

    it('should delete product', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      // Verify product is deleted
      const deletedProduct = await Product.findByPk(productId);
      expect(deletedProduct).toBeNull();
    });
  });
}); 