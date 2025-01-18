const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();  // To load environment variables from .env file

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully!');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  jobTitle: String,
  status: { type: String, default: 'Pending' },
  resumeFileUrl: String,
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// API route to create a referral
app.post('/api/referral', upload.single('resume'), async (req, res) => {
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
    res.status(200).json({ message: 'Candidate referred successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Error in referral', error: err });
  }
});

// API route to get all candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching candidates', error: err });
  }
});

// API route to update a candidate
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

// API route to delete a candidate
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
