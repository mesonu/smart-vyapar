require('dotenv').config();
const { execSync } = require('child_process');

const env = process.env.NODE_ENV || 'development';

try {
  console.log(`Running migrations for ${env} environment...`);
  
  // Run migrations
  execSync('npx sequelize-cli db:migrate', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: env
    }
  });

  console.log('Migrations completed successfully!');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
} 