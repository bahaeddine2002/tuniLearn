// (removed duplicate misplaced static admin middleware)
const express = require("express");
const cors = require("cors");

const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const app = express();

// Static user middleware for dev/testing (no DB call)
app.use((req, res, next) => {
  // Use static teacher for course creation, admin for everything else
  if (req.method === 'POST' && req.path.startsWith('/api/courses')) {
    req.user = {
      userId: 2,
      name: 'Teacher User',
      email: 'teacher@tunilearn.com',
      role: 'TEACHER',
      googleId: 'teacher-google-id',
    };
  } else {
    req.user = {
      userId: 1,
      name: 'Admin User',
      email: 'admin@tunilearn.com',
      role: 'ADMIN',
      googleId: 'admin-google-id',
    };
  }
  next();
});
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
}));
app.use(morgan('dev'));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

const enrollmentRoutes = require('./routes/enrollment.routes');
const teacherRoutes = require('./routes/teacher.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/users', userRoutes);

// Sample route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

module.exports = app;