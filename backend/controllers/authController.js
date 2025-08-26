const User = require('../models/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

/* ================================
   EMAIL TRANSPORTER
================================ */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS environment variables not set');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
    port: 465,
  });
};

let transporter;
try {
  transporter = createTransporter();
  console.log('✅ Mail transporter configured successfully');
} catch (err) {
  console.error('❌ Failed to configure mail transporter:', err.message);
}

/* ================================
   SEND USER CONFIRMATION EMAIL
================================ */
async function sendUserConfirmationEmail(email, name) {
  if (!transporter) throw new Error('Email transporter not configured');

  const mailOptions = {
    from: `"ISGA ENTERPRISE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Car Rental Service',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your account has been successfully created.</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Registration Date:</b> ${new Date().toLocaleDateString()}</p>
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login">Login Here</a>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/* ================================
   REGISTER USER
================================ */
exports.registerUser = async (req, res) => {
  const { name, username, email, city, address, NICNumber, phoneNumber, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      username,
      email,
      city,
      address,
      NICNumber,
      phoneNumber,
      password: hashedPassword,
    });

    await user.save();

    sendUserConfirmationEmail(email, name)
      .then(() => console.log(`📧 Confirmation email sent to ${email}`))
      .catch((err) => console.error('❌ Email sending failed:', err));

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/* ================================
   LOGIN USER
================================ */
exports.loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or username' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/* ================================
   FORGOT PASSWORD
================================ */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; // expect { email }
    const user = await User.findOne({ email });

    // Always respond success to avoid user enumeration
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

    if (!transporter) {
      console.error('❌ Email transporter not configured');
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    await transporter.sendMail({
      from: `"ISGA ENTERPRISE" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset your password',
      html: `
        <p>Hello ${user.name || ''},</p>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour. If you didn’t request this, you can ignore this email.</p>
      `,
    });

    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: 'Failed to start password reset' });
  }
};

/* ================================
   RESET PASSWORD
================================ */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
};
