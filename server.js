const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Set up Express app
const app = express();
app.use(cors()); // Allow requests from different origins
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files for uploaded resumes

// Set up Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/candidateDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Candidate Schema with new fields
const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  jobTitle: String,
  status: { type: String, default: 'Pending' },
  resumeFileUrl: String, // Store the URL of the uploaded file
});

// Create Candidate Model
const Candidate = mongoose.model('Candidate', candidateSchema);

// POST route to submit referral form
app.post('/api/referral', upload.single('resume'), async (req, res) => {
  const { name, email, phoneNumber, jobTitle, status } = req.body;
  const resumeFileUrl = req.file ? `/uploads/${req.file.filename}` : null; // Get resume file URL

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
    res.status(200).json({ message: 'Candidate referred successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Error in referral', error: err });
  }
});

// GET route to get all referred candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching candidates', error: err });
  }
});

// PUT route to update candidate status
app.put('/api/candidates/:id', upload.single('resume'), async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const { name, email, phoneNumber, jobTitle, status } = req.body;
    const resumeFileUrl = req.file ? `/uploads/${req.file.filename}` : candidate.resumeFileUrl;

    candidate.name = name || candidate.name;
    candidate.email = email || candidate.email;
    candidate.phoneNumber = phoneNumber || candidate.phoneNumber;
    candidate.jobTitle = jobTitle || candidate.jobTitle;
    candidate.status = status || candidate.status;
    candidate.resumeFileUrl = resumeFileUrl;

    await candidate.save();
    res.status(200).json(candidate);
  } catch (err) {
    res.status(400).json({ message: 'Error updating candidate', error: err });
  }
});

// DELETE route to delete a candidate
app.delete('/api/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting candidate', error: err });
  }
});

// Start the server
app.listen(3009, () => {
  console.log('Server running on http://localhost:3009');
});
