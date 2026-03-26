import express from 'express';
import {
  adminLogin,
  initializeAdmin,
  getAdminProfile,
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);
router.post('/initialize', initializeAdmin);

// Protected routes
router.get('/profile', authenticateToken, getAdminProfile);

export default router;
