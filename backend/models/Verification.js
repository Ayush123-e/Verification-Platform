const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
    unique: true
  },

  // Aadhaar (UIDAI) verification result
  aadhaarStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  aadhaarReferenceId: { type: String, default: null },
  aadhaarMessage:    { type: String, default: null },
  aadhaarExtracted:  { type: mongoose.Schema.Types.Mixed, default: null },

  // PAN (NSDL) verification result
  panStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  panReferenceId: { type: String, default: null },
  panMessage:     { type: String, default: null },
  panExtracted:   { type: mongoose.Schema.Types.Mixed, default: null },

  verificationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Verification', VerificationSchema);
