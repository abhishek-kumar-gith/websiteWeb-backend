import { Admin } from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';
import { config } from '../config/variables.js';

// Admin login
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordMatch = await admin.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken({
      id: admin._id,
      email: admin.email,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Initialize default admin (run once)
export const initializeAdmin = async (req, res, next) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: config.adminEmail });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      });
    }

    const admin = new Admin({
      email: config.adminEmail,
      password: config.adminPassword,
      name: 'Admin',
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin initialized successfully',
      data: {
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get admin profile
export const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};
