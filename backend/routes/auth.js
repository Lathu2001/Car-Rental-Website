const express = require('express');
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// Register & Login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
