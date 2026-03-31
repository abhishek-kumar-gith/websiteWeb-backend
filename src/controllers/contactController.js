import { Contact } from '../models/Contact.js';

// Create a new contact message
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, services, message } = req.body;

    // Log incoming data for debugging
    console.log('📥 Received request body:', req.body);
    console.log('📋 Services received:', services);
    console.log('📋 Services type:', typeof services);
    console.log('📋 Is array?', Array.isArray(services));

    // Validation
    if (!name || !email || !message) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    // Validate services - must be array with at least one service
    if (!services || !Array.isArray(services) || services.length === 0) {
      console.log('❌ Services validation failed. Services:', services);
      return res.status(400).json({
        success: false,
        message: 'Please select at least one service',
      });
    }

    console.log('✅ All validations passed');
    console.log('💾 Creating contact with services:', services);

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      services,
      message,
    });

    console.log('📝 Contact object before save:', JSON.stringify(contact, null, 2));
    console.log('📝 Services value in contact object:', contact.services);

    const savedContact = await contact.save();
    
    console.log('✅ Contact saved successfully');
    console.log('💾 Saved contact object:', JSON.stringify(savedContact, null, 2));
    console.log('✅ Final services in DB:', savedContact.services);

    res.status(201).json({
      success: true,
      message: 'Contact message saved successfully',
      data: savedContact,
    });
  } catch (error) {
    console.error('❌ Error in createContact:', error.message);
    console.error('❌ Full error:', error);
    console.error('❌ Validation errors:', error.errors);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => {
        console.log('Validation Error Details:', err.message, err.path);
        return `${err.path}: ${err.message}`;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed: ' + messages.join(', '),
        errors: error.errors,
      });
    }
    
    // Handle other errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
      });
    }
    
    next(error);
  }
};

// Get all contact messages (admin only)
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    console.log('📥 Fetching all contacts');
    console.log('📊 Total contacts found:', contacts.length);
    if (contacts.length > 0) {
      console.log('📋 First contact services:', contacts[0].services);
      console.log('📋 First contact object:', JSON.stringify(contacts[0], null, 2));
    }

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('❌ Error in getAllContacts:', error.message);
    next(error);
  }
};

// Get a single contact by ID
export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    // Mark as read
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a contact message
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get unread contacts count
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Contact.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    next(error);
  }
};
