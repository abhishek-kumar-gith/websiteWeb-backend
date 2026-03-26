import jwt from 'jsonwebtoken';
import { config } from '../config/variables.js';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
};
