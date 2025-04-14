require('dotenv').config();

console.log("NODE_ENV:::::", process.env.NODE_ENV || 'development');
console.log("DB_USERNAME:::", process.env.DB_USERNAME || 'druvika');
console.log("DB_PASSWORD:::", process.env.DB_PASSWORD || 'druvika');
console.log("DB_NAME:::", process.env.DB_NAME || 'invoice_system');
console.log("DB_HOST:::", process.env.DB_HOST || 'localhost');
console.log("DB_PORT:::", process.env.DB_PORT || 5432);
console.log("Current Directory:", process.cwd());

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'druvika',
    password: process.env.DB_PASSWORD || 'druvika',
    database: process.env.DB_NAME || 'invoice_system',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
  },
  test: {
    username: process.env.DB_USERNAME || 'druvika',
    password: process.env.DB_PASSWORD || 'druvika',
    database: process.env.DB_NAME || 'invoice_system_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  },
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRATION || '24h'
  },
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  whatsappApiKey: process.env.WHATSAPP_API_KEY || '',
  whatsappApiUrl: process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send',
  smsApiKey: process.env.SMS_API_KEY || '',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  ROLES:{
    ADMIN: 'admin', // admin
    CUSTOMER: 'customer', // customer
    USER:'user', // business user 
    MANAGER: 'manager', // infuture may be 
    STAFF: 'staff' // infuture may be 
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    fromName: process.env.EMAIL_FROM_NAME || 'Your App Name'
  },
  //databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/invoice_system'
}


 