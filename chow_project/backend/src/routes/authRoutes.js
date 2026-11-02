import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const identifier = (username || email || '').trim().toLowerCase();
    const pass = (password || '').trim();

    let user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    });

    if (user) {
      // Check password using bcrypt or plain-text fallback (for backward compatibility)
      let isMatch = false;
      try {
        isMatch = await bcrypt.compare(pass, user.password);
      } catch (_e) {
        isMatch = false;
      }

      if (!isMatch && user.password !== pass) {
        return res.status(401).json({ message: 'Invalid credentials. Please check your password.' });
      }

      // If user had plain text password, automatically re-hash and update in DB
      if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        user.password = await bcrypt.hash(pass, 10);
        await user.save();
      }
    } else if (role) {
      user = await User.findOne({ role: role.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register or select a valid role.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, age, gender, chronicConditions, password, username } = req.body;

    const userEmail = (email || `patient_${Date.now()}@hospital.org`).toLowerCase().trim();
    const userUname = (username || (email ? email.split('@')[0] : `patient_${Date.now()}`)).toLowerCase().trim();

    // Check if user already exists
    const existing = await User.findOne({ $or: [{ email: userEmail }, { username: userUname }] });
    if (existing) {
      return res.status(400).json({ message: 'User with this email or username already exists.' });
    }

    // Securely hash the password
    const hashedPassword = await bcrypt.hash(password || '123456', 10);

    const newUser = await User.create({
      name: name || 'New Patient',
      username: userUname,
      email: userEmail,
      password: hashedPassword,
      phone: phone || '+1 555-0000',
      age: Number(age) || 30,
      gender: gender || 'Other',
      chronicConditions: chronicConditions || 'None',
      role: 'patient'
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user: user || req.user });
  } catch (err) {
    res.json({ user: req.user });
  }
});

export default router;
