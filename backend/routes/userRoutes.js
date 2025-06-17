const express = require('express');
const router = express.Router();
const User = require('../models/Auth');
const jwt = require('jsonwebtoken');

// GET all users - Admin only
router.get('/all', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // exclude passwords
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});


const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("🔐 Incoming token:", authHeader);

    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token verified. User ID:", decoded.id);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// GET user details of logged-in user
router.get('/me', authenticate, async (req, res) => {
    console.log("📥 GET /api/users/me called");

    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("✅ User data fetched:", user);
        res.json(user);
    } catch (err) {
        console.error("❌ Error fetching user:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete', authenticate, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting account:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// PUT /api/users/update
router.put('/update', authenticate, async (req, res) => {
    try {
        const updateFields = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            city: req.body.city,
            address: req.body.address,
            NICNumber: req.body.NICNumber,
            phoneNumber: req.body.phoneNumber
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("❌ Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

