const Candidate = require("../models/Candidate");

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addCandidate = async (req, res) => {
  const { name, email, phone, jobTitle } = req.body;

  try {
    const newCandidate = new Candidate({ name, email, phone, jobTitle });
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(400).json({ message: "Error saving candidate" });
  }
};

exports.updateCandidateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ message: "Error updating candidate status" });
  }
};
