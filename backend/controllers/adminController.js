const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const ADMIN_CODE = 'isgaareyoufree';

/* ================================
   EMAIL TRANSPORT WITH BETTER CONFIG
================================ */
const createTransport = () => {
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

let transporte;
try {
  transport = createTransport();
  console.log('✅ Admin Mail transport configured successfully');
  // Removed verification - will work when sending emails
} catch (err) {
  console.error('❌ Failed to configure admin mail transport:', err.message);
}

/* ================================
   SEND EMAIL WITH RETRY LOGIC
================================ */
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
  if (!transport) {
    throw new Error('Email transport not configured');
  }

  // Verify connection on first use
  if (!transport.verified) {
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Verification timeout'));
        }, 10000); // 10 second timeout for verification

        transport.verify((error, success) => {
          clearTimeout(timeout);
          if (error) {
            console.error('❌ Admin SMTP verification failed on first use:', error.message);
            reject(error);
          } else {
            console.log('✅ Admin SMTP server verified on first use');
            transport.verified = true;
            resolve(success);
          }
        });
      });
    } catch (verifyError) {
      console.log('⚠️ Admin verification failed but proceeding with send attempt');
    }
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await transport.sendMail(mailOptions);
      console.log(`📧 Admin email sent successfully on attempt ${attempt}`);
      return result;
    } catch (error) {
      console.error(`❌ Admin email attempt ${attempt} failed:`, error.message);
      
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
   SEND CONFIRMATION EMAIL
================================ */
async function sendConfirmationEmail(email, name) {
  const mailOptions = {
    from: `"ISGA ENTERPRISE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Admin Registration Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">Welcome to Admin Panel</h1>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #28a745; margin-top: 0;">Registration Successful!</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your admin account has been successfully created. You can now log in to the admin panel.</p>
        </div>
        <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3>Account Details:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'https://isga-enterprise.vercel.app'}/admin-login"
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
            Login to Admin Panel
          </a>
        </div>
        <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center; color: #6c757d; font-size: 14px;">
          <p>If you didn't request this registration, please contact support immediately.</p>
          <p>This email was sent automatically. Please do not reply.</p>
        </div>
      </div>
    `
  };

  return sendEmailWithRetry(mailOptions);
}

/* ================================
   REGISTER ADMIN
================================ */
exports.registerAdmin = async (req, res) => {
  const { name, userId, email, password, adminCode } = req.body;

  try {
    if (adminCode !== ADMIN_CODE) {
      return res.status(400).json({ message: 'Invalid admin code' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = new Admin({ name, userId, email, password: hashedPassword });
    await admin.save();

    // Send email asynchronously (don't wait for it)
    sendConfirmationEmail(email, name)
      .then(() => console.log(`📧 Admin confirmation email sent to ${email}`))
      .catch(err => console.error('❌ Admin email sending failed:', err.message));

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/* ================================
   LOGIN ADMIN
================================ */
exports.loginAdmin = async (req, res) => {
  const { email, userId, password } = req.body;

  try {
    const admin = await Admin.findOne({ $or: [{ email }, { userId }] });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/* ================================
   GET ADMIN DETAILS
================================ */
exports.getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.json(admin);
  } catch (err) {
    console.error('Error getting admin details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================================
   UPDATE ADMIN
================================ */
exports.updateAdmin = async (req, res) => {
  try {
    const updateFields = {
      name: req.body.name,
      userId: req.body.userId,
      email: req.body.email
    };

    if (req.body.password) {
      const saltRounds = 12;
      updateFields.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.admin.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });

    res.json(updatedAdmin);
  } catch (err) {
    console.error('Error updating admin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================================
   CHANGE PASSWORD (AUTH REQUIRED)
================================ */
exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const ok = await bcrypt.compare(currentPassword, admin.password);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

    const saltRounds = 12;
    admin.password = await bcrypt.hash(newPassword, saltRounds);
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('changeAdminPassword error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================================
   FORGOT ADMIN PASSWORD WITH IMPROVED ERROR HANDLING
================================ */
exports.forgotAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const admin = await Admin.findOne({ email });

    // Always respond success to avoid user enumeration
    if (!admin) {
      return res.json({ message: 'If that admin email exists, a reset link has been sent.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

    admin.resetPasswordToken = hashed;
    admin.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await admin.save();

    const resetUrl = `${process.env.CLIENT_URL || 'https://isga-enterprise.vercel.app'}/admin-reset-password/${rawToken}`;

    if (!transport) {
      console.error('❌ Email transport not configured');
      return res.json({ message: 'If that admin email exists, a reset link has been sent.' });
    }

    const mailOptions = {
      from: `"ISGA ENTERPRISE" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: 'Reset your admin password - ISGA ENTERPRISE',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Admin Password Reset Request</h2>
          <p>Hello ${admin.name || 'Admin'},</p>
          <p>You requested a password reset for your ISGA ENTERPRISE admin account.</p>
          <p>Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Admin Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please contact support immediately.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            This email was sent by ISGA ENTERPRISE Car Rental Service - Admin System.
          </p>
        </div>
      `,
    };

    try {
      await sendEmailWithRetry(mailOptions);
      console.log(`📧 Admin password reset email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send admin password reset email:', emailError.message);
      // Don't reveal email sending failure to avoid information disclosure
    }

    return res.json({ message: 'If that admin email exists, a reset link has been sent.' });
    
  } catch (err) {
    console.error('forgotAdminPassword error:', err);
    return res.status(500).json({ message: 'Failed to start password reset' });
  }
};

/* ================================
   RESET ADMIN PASSWORD
================================ */
exports.resetAdminPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' });
    }

    admin.password = await bcrypt.hash(password, 12);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    console.log(`✅ Admin password reset successfully for: ${admin.email}`);
    return res.json({ message: 'Admin password has been reset successfully' });
    
  } catch (err) {
    console.error('resetAdminPassword error:', err);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
};

/* ================================
   DELETE ADMIN
================================ */
exports.deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.admin.id);
    if (!deleted) return res.status(404).json({ message: 'Admin not found' });

    res.json({ message: 'Admin account deleted successfully' });
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};