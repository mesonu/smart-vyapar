const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartVyapar API Documentation',
      version: '1.0.0',
      description: 'API documentation for SmartVyapar - An AI-powered Inventory and Business Management System',
      contact: {
        name: 'SmartVyapar Support',
        email: 'support@smartvyapar.com',
        url: 'https://smartvyapar.com'
      },
      license: {
        name: 'Proprietary',
        url: 'https://smartvyapar.com/license'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.smartvyapar.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Error message description'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Products',
        description: 'Product management endpoints'
      },
      {
        name: 'Customers',
        description: 'Customer management endpoints'
      },
      {
        name: 'Invoices',
        description: 'Invoice management endpoints'
      },
      {
        name: 'Promotions',
        description: 'Promotion and marketing management endpoints'
      },
      {
        name: 'Analytics',
        description: 'Business analytics and reporting endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 