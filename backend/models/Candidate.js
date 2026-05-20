const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Candidate full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Candidate email is required'],
    trim: true,
    lowercase: true
  },
  dob: {
    type: Date,
    required: [true, 'Candidate date of birth is required']
  },
  aadhaarNumber: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    trim: true
  },
  panNumber: {
    type: String,
    required: [true, 'PAN number is required'],
    trim: true,
    uppercase: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);
