const express = require('express');
const router = express.Router();
const User = require('../models/Auth');

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

module.exports = router;
