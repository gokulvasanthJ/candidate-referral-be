const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const candidateRoutes = require("./routes/candidateRoutes");

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/api/candidates", candidateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
