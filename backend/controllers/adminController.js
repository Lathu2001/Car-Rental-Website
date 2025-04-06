const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const ADMIN_CODE = 'isgaareyoufree'; // Define the admin code

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

        const admin = new Admin({
            name,
            userId,
            email,
            password,
        });

        await admin.save();

        // Send confirmation email
        sendConfirmationEmail(email, name);

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Admin Login
exports.loginAdmin = async (req, res) => {
    const { email, userId, password } = req.body;

    try {
        const admin = await Admin.findOne({ $or: [{ email }, { userId }] });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (password !== admin.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address from the environment
        pass: process.env.EMAIL_PASS, // Your email password from the environment
    },
});

// Function to send confirmation email
const sendConfirmationEmail = (email, name) => {
    const mailOptions = {
        from: 'isgaholding@gmail.com',
        to: email,
        subject: 'Registration Successful - ISGA Holding',
        text: `Dear ${name},\n\nThank you for registering on the ISGA Holding platform.\n\nWe are delighted to have you as part of our community.\n\nBest regards,\nISGA Holding Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};