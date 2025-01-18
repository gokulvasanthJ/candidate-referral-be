const express = require('express');
const multer = require('multer');
const path = require('path');
const { addCandidate, getCandidates, updateCandidateStatus, deleteCandidate } = require('../controllers/candidateController');

const router = express.Router();

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

// POST route to submit referral form
router.post('/', upload.single('resume'), addCandidate);

// GET route to get all referred candidates
router.get('/', getCandidates);

// PUT route to update candidate details
router.put('/:id', upload.single('resume'), updateCandidateStatus);

// DELETE route to delete candidate
router.delete('/:id', deleteCandidate);

module.exports = router;
