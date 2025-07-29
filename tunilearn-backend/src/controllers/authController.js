const authService = require('../services/auth.service');
const { signJwt } = require('../utils/jwt');
const bcrypt = require('bcrypt');
const validator = require('validator');


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });

    }

     if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0, // set to 1 if you want to force special chars
    })) {
      return res.status(400).json({
        message: 'Password is too weak. Use at least 8 characters, with one uppercase letter, one lowercase letter, and one number.'
      });
    }

 
    const existing = await authService.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

   
    
    if (!['STUDENT', 'TEACHER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }


    const user = await authService.createUser({ name, email, password, role });
    const token = signJwt({ userId: user.id, role: user.role });

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signJwt({ userId: user.id, role: user.role });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};