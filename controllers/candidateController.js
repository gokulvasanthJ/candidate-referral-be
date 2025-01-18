const Candidate = require('../models/candidate'); // Assuming you have this model in 'models/candidate'

// Add new candidate (Referral form)
exports.addCandidate = async (req, res) => {
  const { name, email, phoneNumber, jobTitle, status } = req.body;
  const resumeFileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const newCandidate = new Candidate({
    name,
    email,
    phoneNumber,
    jobTitle,
    status,
    resumeFileUrl,
  });

  try {
    await newCandidate.save();
    res.status(200).json({ message: 'Candidate referred successfully!', candidate: newCandidate });
  } catch (err) {
    res.status(400).json({ message: 'Error in referral', error: err });
  }
};

// Get all candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching candidates', error: err });
  }
};

// Update candidate status or other details
exports.updateCandidateStatus = async (req, res) => {
  const { id } = req.params; // Get candidate ID from URL
  const { status, name, email, phoneNumber, jobTitle } = req.body;

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      { status, name, email, phoneNumber, jobTitle },
      { new: true } // Return the updated document
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(updatedCandidate);
  } catch (err) {
    res.status(400).json({ message: 'Error updating candidate', error: err });
  }
};

// Delete candidate
exports.deleteCandidate = async (req, res) => {
  const { id } = req.params; // Get candidate ID from URL

  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(id);
    if (!deletedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting candidate', error: err });
  }
};
