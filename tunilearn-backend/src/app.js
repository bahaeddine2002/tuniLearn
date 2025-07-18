const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Sample route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

module.exports = app;