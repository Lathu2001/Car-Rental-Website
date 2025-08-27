const User = require('../models/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

/* ================================
   EMAIL TRANSPORTER WITH BETTER CONFIG
================================ */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS environment variables not set');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds  
    socketTimeout: 60000, // 60 seconds
    pool: true, // Use connection pooling
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 14, // Limit to 14 messages per second
    tls: {
      rejectUnauthorized: false
    }
  });
};

let transporter;
try {
  transporter = createTransporter();
  console.log('✅ Mail transporter configured successfully');
  
  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ SMTP verification failed:', error);
    } else {
      console.log('✅ SMTP server is ready to take our messages');
    }
  });
} catch (err) {
  console.error('❌ Failed to configure mail transporter:', err.message);
}

/* ================================
   SEND EMAIL WITH RETRY LOGIC
================================ */
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
  if (!transporter) {
    throw new Error('Email transporter not configured');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully on attempt ${attempt}`);
      return result;
    } catch (error) {
      console.error(`❌ Email attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

/* ================================
   SEND USER CONFIRMATION EMAIL
================================ */
async function sendUserConfirmationEmail(email, name) {
  const mailOptions = {
    from: `"ISGA ENTERPRISE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Car Rental Service',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your account has been successfully created.</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Registration Date:</b> ${new Date().toLocaleDateString()}</p>
      <a href="${process.env.CLIENT_URL || 'https://isga-enterprise.vercel.app'}/login">Login Here</a>
    `,
  };

  return sendEmailWithRetry(mailOptions);
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

    // Send email asynchronously (don't wait for it)
    sendUserConfirmationEmail(email, name)
      .then(() => console.log(`📧 Confirmation email sent to ${email}`))
      .catch((err) => console.error('❌ Email sending failed:', err.message));

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
   FORGOT PASSWORD WITH IMPROVED ERROR HANDLING
================================ */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

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

    const resetUrl = `${process.env.CLIENT_URL || 'https://isga-enterprise.vercel.app'}/reset-password/${rawToken}`;

    if (!transporter) {
      console.error('❌ Email transporter not configured');
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const mailOptions = {
      from: `"ISGA ENTERPRISE" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset your password - ISGA ENTERPRISE',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name || 'User'},</p>
          <p>You requested a password reset for your ISGA ENTERPRISE account.</p>
          <p>Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            This email was sent by ISGA ENTERPRISE Car Rental Service.
          </p>
        </div>
      `,
    };

    try {
      await sendEmailWithRetry(mailOptions);
      console.log(`📧 Password reset email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError.message);
      // Don't reveal email sending failure to avoid information disclosure
    }

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

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
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

    console.log(`✅ Password reset successfully for user: ${user.email}`);
    return res.json({ message: 'Password has been reset successfully' });
    
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
};