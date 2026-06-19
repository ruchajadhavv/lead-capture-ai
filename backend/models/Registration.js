const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, trim: true },
  businessName: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  aiScore: {
    type: String,
    enum: ['Hot', 'Warm', 'Cold'],
    default: null,
  },
  aiScoreReason: { type: String, default: null },
  aiEmailDraft: { type: String, default: null },
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;


