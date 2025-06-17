const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const ADMIN_CODE = 'isgaareyoufree';

// Register Admin
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
            password, // storing plain text (just for dev)
        });

        await admin.save();

        sendConfirmationEmail(email, name);
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
    const { email, userId, password } = req.body;

    try {
        const admin = await Admin.findOne({ $or: [{ email }, { userId }] });
        if (!admin || admin.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Fetch logged-in admin details
exports.getAdminDetails = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update admin details
exports.updateAdmin = async (req, res) => {
    try {
        const updateFields = {
            name: req.body.name,
            userId: req.body.userId,
            email: req.body.email
        };

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

// Delete admin account
exports.deleteAdmin = async (req, res) => {
    try {
        const deleted = await Admin.findByIdAndDelete(req.admin.id);
        if (!deleted) return res.status(404).json({ message: 'Admin not found' });

        res.json({ message: 'Admin account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};