const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const ADMIN_CODE = 'isgaareyoufree';

/* ================================
   EMAIL TRANSPORTER (Strict Mode)
================================ */
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("❌ EMAIL_USER or EMAIL_PASS environment variables not set");
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        secure: true, // Gmail prefers SSL
        port: 465
    });
};

let transporter;
try {
    transporter = createTransporter();
    console.log("✅ Mail transporter ready");
} catch (err) {
    console.error("❌ Failed to init transporter:", err.message);
}


/* ================================
   SEND CONFIRMATION EMAIL
================================ */
async function sendConfirmationEmail(email, name) {
    if (!transporter) throw new Error("❌ Email transporter not configured");

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
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/login"
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

    return transporter.sendMail(mailOptions);
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

        // Try sending confirmation email
        sendConfirmationEmail(email, name)
            .then(() => console.log(`📧 Confirmation email sent to ${email}`))
            .catch(err => console.error("❌ Email sending failed:", err));

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
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
        res.status(500).json({ message: 'Server error' });
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
        res.status(500).json({ message: 'Server error' });
    }
};
