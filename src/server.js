import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { config } from './config/variables.js';
import { errorHandler } from './middleware/errorHandler.js';
import { Admin } from './models/Admin.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Auto-initialize admin user on startup
const initializeAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: config.adminEmail });
    if (!existingAdmin) {
      const admin = new Admin({
        email: config.adminEmail,
        password: config.adminPassword,
        name: 'Admin',
      });
      await admin.save();
      console.log('✓ Admin user initialized successfully');
    } else {
      console.log('✓ Admin user already exists');
    }
  } catch (error) {
    console.error('✗ Error initializing admin:', error.message);
  }
};

// Initialize admin after a short delay to ensure DB connection
setTimeout(initializeAdmin, 1000);

// Middleware
// Configure CORS to allow localhost and tunneled URLs
app.use(cors({
  origin: [
    "http://localhost:5173", // local dev
    "https://website-web-frontend.vercel.app" // tumhara Vercel frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     Webocore Backend Server Started    ║
║     Port: ${PORT}                          ║
║     Environment: ${config.nodeEnv}              ║
╚════════════════════════════════════════╝
  `);
});

export default app;
