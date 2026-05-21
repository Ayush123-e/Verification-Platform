const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { createError } = require('../middleware/errorHandler');

/**
 * Register a new agency user.
 * @param {object} fields - { name, email, password, company }
 * @returns {{ user, token }}
 */
const registerUser = async ({ name, email, password, company }) => {
  if (!name || !email || !password || !company) {
    throw createError(400, 'All fields are required: name, email, password, company');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw createError(400, 'User already exists with this email');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    company
  });

  const token = generateToken(user._id);

  return {
    user: { _id: user._id, name: user.name, email: user.email, company: user.company },
    token
  };
};

/**
 * Authenticate an existing user.
 * @param {object} fields - { email, password }
 * @returns {{ user, token }}
 */
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw createError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Invalid credentials');
  }

  const token = generateToken(user._id);

  return {
    user: { _id: user._id, name: user.name, email: user.email, company: user.company },
    token
  };
};

/**
 * Get a user profile by ID.
 * @param {string} userId
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw createError(404, 'User not found');
  return user;
};

module.exports = { registerUser, loginUser, getUserById };
