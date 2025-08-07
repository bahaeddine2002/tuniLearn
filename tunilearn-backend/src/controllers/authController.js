const { PrismaClient } = require('@prisma/client');
const { signJwt, verifyJwt } = require('../utils/jwt');

const prisma = new PrismaClient();

// Google OAuth success handler
exports.googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const user = req.user;
    const token = signJwt({ 
      userId: user.id, 
      role: user.role,
      profileCompleted: user.profileCompleted 
    });

    // Set secure HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect based on profile completion status
    if (!user.profileCompleted) {
      return res.redirect(`${process.env.FRONTEND_URL}/complete-profile`);
    }

    // Redirect to appropriate dashboard based on role
    const dashboardRoutes = {
      STUDENT: '/student/dashboard',
      TEACHER: '/teacher/dashboard',
      ADMIN: '/admin/dashboard'
    };

    const redirectPath = dashboardRoutes[user.role] || '/';
    res.redirect(`${process.env.FRONTEND_URL}${redirectPath}`);
  } catch (error) {
    console.error('Google auth success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

// Complete user profile
exports.completeProfile = async (req, res) => {
  try {
    const { role, bio } = req.body;
    const userId = req.user.userId;

    if (!['STUDENT', 'TEACHER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        bio: bio || null,
        profileCompleted: true,
      },
    });

    const newToken = signJwt({
      userId: updatedUser.id,
      role: updatedUser.role,
      profileCompleted: true,
    });

    res.cookie('auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Profile completed successfully!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImageUrl: updatedUser.profileImageUrl,
        bio: updatedUser.bio,
        profileCompleted: updatedUser.profileCompleted,
      },
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImageUrl: true,
        bio: true,
        profileCompleted: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Logout
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed.' });
    }
    
    res.clearCookie('auth_token');
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
};

// Check authentication status
exports.checkAuth = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const decoded = verifyJwt(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImageUrl: true,
        bio: true,
        profileCompleted: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    res.status(200).json({ 
      authenticated: true, 
      user,
      profileCompleted: user.profileCompleted 
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};