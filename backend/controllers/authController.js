const authService = require('../services/authService');

/** POST /api/auth/signup */
const registerUser = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({ success: true, data: { ...result.user, token: result.token } });
  } catch (err) {
    next(err);
  }
};

/** POST /api/auth/login */
const loginUser = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json({ success: true, data: { ...result.user, token: result.token } });
  } catch (err) {
    next(err);
  }
};

/** GET /api/auth/profile */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
