const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET  || 'supersecretkey_background_verification_xyz';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '30d';

/**
 * Generate a signed JWT token for a user id.
 * @param {string} id - Mongoose user _id
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws Will throw if token is invalid or expired
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
