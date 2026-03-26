import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
  getUnreadCount,
} from '../controllers/contactController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createContact);
router.get('/unread-count', getUnreadCount);

// Protected routes (admin only)
router.get('/', authenticateToken, getAllContacts);
router.get('/:id', authenticateToken, getContactById);
router.delete('/:id', authenticateToken, deleteContact);

export default router;
