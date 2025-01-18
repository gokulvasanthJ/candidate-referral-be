const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  referredBy: { type: String, required: true },
});

module.exports = mongoose.model('Candidate', CandidateSchema);
