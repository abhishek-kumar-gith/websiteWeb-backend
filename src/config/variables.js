import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/webocore',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@webocore.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
};
