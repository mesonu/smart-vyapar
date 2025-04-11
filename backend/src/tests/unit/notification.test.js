const { testConfig, sequelize } = require('../setup');
const request = require('supertest');
const app = require('../../app');
const { Notification, User, NotificationTemplate, WhatsappTemplate } = require('../../models');

describe('Notification API Tests', () => {
  let token;
  let testUser;
  let testTemplate;
  let testWhatsappTemplate;

  // Test data
  const testNotification = {
    type: 'email',
    subject: 'Test Notification',
    message: 'This is a test notification',
    status: 'pending',
    priority: 'normal'
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

    // Create test email template
    testTemplate = await NotificationTemplate.create({
      name: 'Test Template',
      subject: 'Test Subject',
      body: 'Test Body',
      type: 'email'
    });

    // Create test WhatsApp template
    testWhatsappTemplate = await WhatsappTemplate.create({
      name: 'Test WhatsApp Template',
      template_id: 'test_template_123',
      category: 'ALERT',
      language: 'en',
      components: [
        {
          type: 'BODY',
          text: 'Test WhatsApp message'
        }
      ]
    });
  });

  describe('POST /api/notifications', () => {
    it('should create a new notification', async () => {
      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testNotification,
          user_id: testUser.id,
          template_id: testTemplate.id
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe(testNotification.type);
      expect(response.body.user_id).toBe(testUser.id);
    });

    it('should create WhatsApp notification', async () => {
      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testNotification,
          type: 'whatsapp',
          user_id: testUser.id,
          whatsapp_template_id: testWhatsappTemplate.id
        });

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('whatsapp');
      expect(response.body.whatsapp_template_id).toBe(testWhatsappTemplate.id);
    });
  });

  describe('GET /api/notifications', () => {
    beforeEach(async () => {
      // Create test notifications
      await Notification.create({
        ...testNotification,
        user_id: testUser.id,
        template_id: testTemplate.id
      });
    });

    it('should get all notifications', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter notifications by type', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`)
        .query({ type: 'email' });

      expect(response.status).toBe(200);
      expect(response.body.every(n => n.type === 'email')).toBe(true);
    });
  });

  describe('GET /api/notifications/:id', () => {
    let notificationId;

    beforeEach(async () => {
      const notification = await Notification.create({
        ...testNotification,
        user_id: testUser.id,
        template_id: testTemplate.id
      });
      notificationId = notification.id;
    });

    it('should get notification by id', async () => {
      const response = await request(app)
        .get(`/api/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(notificationId);
      expect(response.body.type).toBe(testNotification.type);
    });

    it('should return 404 for non-existent notification', async () => {
      const response = await request(app)
        .get('/api/notifications/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/notifications/:id', () => {
    let notificationId;

    beforeEach(async () => {
      const notification = await Notification.create({
        ...testNotification,
        user_id: testUser.id,
        template_id: testTemplate.id
      });
      notificationId = notification.id;
    });

    it('should update notification', async () => {
      const updatedData = {
        status: 'sent',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(updatedData.status);
      expect(response.body.priority).toBe(updatedData.priority);
    });
  });

  describe('POST /api/notifications/send', () => {
    let notificationId;

    beforeEach(async () => {
      const notification = await Notification.create({
        ...testNotification,
        user_id: testUser.id,
        template_id: testTemplate.id
      });
      notificationId = notification.id;
    });

    it('should send notification', async () => {
      const response = await request(app)
        .post('/api/notifications/send')
        .set('Authorization', `Bearer ${token}`)
        .send({
          notification_id: notificationId
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('sent');
    });
  });
}); 