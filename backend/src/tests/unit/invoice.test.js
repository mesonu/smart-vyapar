const { testConfig, sequelize } = require('../setup');
const request = require('supertest');
const app = require('../../app');
const { Invoice, Customer, Product, User, InvoiceItem } = require('../../models');

describe('Invoice API Tests', () => {
  let token;
  let testCustomer;
  let testProduct;
  let testUser;

  // Test data
  const testInvoice = {
    invoice_number: 'INV-001',
    issue_date: new Date(),
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'draft',
    total_amount: 199.98,
    tax_amount: 19.99,
    notes: 'Test invoice'
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

    // Create test customer
    testCustomer = await Customer.create({
      name: 'Test Customer',
      email: 'customer@example.com',
      phone: '1234567890',
      address: 'Test Address'
    });

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      sku: 'TEST-001',
      stock_quantity: 100
    });
  });

  describe('POST /api/invoices', () => {
    it('should create a new invoice', async () => {
      const response = await request(app)
        .post('/api/invoices')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testInvoice,
          customer_id: testCustomer.id,
          user_id: testUser.id,
          items: [
            {
              product_id: testProduct.id,
              quantity: 2,
              unit_price: testProduct.price,
              total_price: testProduct.price * 2
            }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.invoice_number).toBe(testInvoice.invoice_number);
      expect(response.body.customer_id).toBe(testCustomer.id);
      expect(response.body.items).toHaveLength(1);
    });

    it('should not create invoice without required fields', async () => {
      const response = await request(app)
        .post('/api/invoices')
        .set('Authorization', `Bearer ${token}`)
        .send({
          notes: 'Missing required fields'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/invoices', () => {
    beforeEach(async () => {
      // Create test invoice
      await Invoice.create({
        ...testInvoice,
        customer_id: testCustomer.id,
        user_id: testUser.id
      });
    });

    it('should get all invoices', async () => {
      const response = await request(app)
        .get('/api/invoices')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter invoices by status', async () => {
      const response = await request(app)
        .get('/api/invoices')
        .set('Authorization', `Bearer ${token}`)
        .query({ status: 'draft' });

      expect(response.status).toBe(200);
      expect(response.body.every(i => i.status === 'draft')).toBe(true);
    });
  });

  describe('GET /api/invoices/:id', () => {
    let invoiceId;

    beforeEach(async () => {
      const invoice = await Invoice.create({
        ...testInvoice,
        customer_id: testCustomer.id,
        user_id: testUser.id
      });
      invoiceId = invoice.id;
    });

    it('should get invoice by id', async () => {
      const response = await request(app)
        .get(`/api/invoices/${invoiceId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(invoiceId);
      expect(response.body.invoice_number).toBe(testInvoice.invoice_number);
    });

    it('should return 404 for non-existent invoice', async () => {
      const response = await request(app)
        .get('/api/invoices/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/invoices/:id', () => {
    let invoiceId;

    beforeEach(async () => {
      const invoice = await Invoice.create({
        ...testInvoice,
        customer_id: testCustomer.id,
        user_id: testUser.id
      });
      invoiceId = invoice.id;
    });

    it('should update invoice', async () => {
      const updatedData = {
        status: 'sent',
        notes: 'Updated notes'
      };

      const response = await request(app)
        .put(`/api/invoices/${invoiceId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(updatedData.status);
      expect(response.body.notes).toBe(updatedData.notes);
    });
  });

  describe('DELETE /api/invoices/:id', () => {
    let invoiceId;

    beforeEach(async () => {
      const invoice = await Invoice.create({
        ...testInvoice,
        customer_id: testCustomer.id,
        user_id: testUser.id
      });
      invoiceId = invoice.id;
    });

    it('should delete draft invoice', async () => {
      const response = await request(app)
        .delete(`/api/invoices/${invoiceId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      // Verify invoice is deleted
      const deletedInvoice = await Invoice.findByPk(invoiceId);
      expect(deletedInvoice).toBeNull();
    });

    it('should not delete non-draft invoice', async () => {
      // Update invoice status to sent
      await Invoice.update(
        { status: 'sent' },
        { where: { id: invoiceId } }
      );

      const response = await request(app)
        .delete(`/api/invoices/${invoiceId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 