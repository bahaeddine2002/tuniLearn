const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();


const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));

// Middlewares
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(require('path').join(__dirname, '../uploads')));


// Routes
const authRoutes = require('./routes/auth.routes');

const courseRoutes = require('./routes/course.routes');
const chapterRoutes = require('./routes/chapter.routes');
const sectionRoutes = require('./routes/section.routes');
const subjectRoutes = require('./routes/subject.routes');


app.use('/api', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/subjects', subjectRoutes);

// Sample route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

module.exports = app;