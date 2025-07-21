const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();


const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));

// Middlewares
app.use(cors());
app.use(express.json());


// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

// Sample route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

module.exports = app;