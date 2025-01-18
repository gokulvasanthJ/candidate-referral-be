const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  jobTitle: { type: String, required: true },
  status: { type: String, default: "Pending" },
  resumeUrl: { type: String },
});

module.exports = mongoose.model("Candidate", candidateSchema);
