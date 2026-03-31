import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    services: {
      type: [String],
      default: [],
      select: true,  // Always include this field in responses
    },
    // Keeping service as deprecated field for backward compatibility
    service: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to debug and validate services
contactSchema.pre('save', function (next) {
  console.log('🔍 Pre-save hook triggered');
  console.log('📋 This.services before save:', this.services);
  console.log('📋 This.services type:', typeof this.services);
  console.log('📋 This.services length:', this.services?.length);
  console.log('📋 Full document:', JSON.stringify(this, null, 2));
  
  // Ensure services is not being cleared
  if (!this.services || this.services.length === 0) {
    console.log('⚠️ WARNING: Services is empty before save');
  }
  
  next();
});

// Post-save middleware to verify services were saved
contactSchema.post('save', function (doc) {
  console.log('✅ Post-save hook triggered');
  console.log('📋 Saved contact services:', doc.services);
  console.log('📋 Saved contact services length:', doc.services?.length);
});

export const Contact = mongoose.model('Contact', contactSchema);
