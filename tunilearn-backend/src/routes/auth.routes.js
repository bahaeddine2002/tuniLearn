const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth.middleware');

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed` }),
  authController.googleAuthSuccess
);

// Profile completion route
router.post('/complete-profile', authenticate, authController.completeProfile);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

// Check authentication status
router.get('/check', authController.checkAuth);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
