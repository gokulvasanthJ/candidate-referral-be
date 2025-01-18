const express = require("express");
const router = express.Router();
const { getCandidates, addCandidate, updateCandidateStatus } = require("../controllers/candidateController");

router.get("/", getCandidates);
router.post("/", addCandidate);
router.put("/:id/status", updateCandidateStatus);

module.exports = router;
