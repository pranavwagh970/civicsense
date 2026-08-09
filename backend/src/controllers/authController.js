import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error('An account with this email already exists.');
    }

    let assignedRole = 'citizen';
    if (role === 'admin') {
      if (!process.env.ADMIN_SETUP_CODE || adminSecret !== process.env.ADMIN_SETUP_CODE) {
        res.status(403);
        throw new Error('Invalid admin setup code.');
      }
      assignedRole = 'admin';
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    res.status(201).json({
      user: sanitizeUser(user),
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required.');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    res.json({
      user: sanitizeUser(user),
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({
    user: sanitizeUser(req.user),
  });
};

