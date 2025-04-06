const User = require('../models/User');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Register user
exports.registerUser = async (req, res) => {
    const { name, username, email, city, address, NICNumber, phoneNumber, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user with the plain password (no hashing)
        const user = new User({
            name,
            username,
            email,
            city,
            address,
            NICNumber,
            phoneNumber,
            password,  // Store password as plain text
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: 'Server error during registration' });
    }
};
// Login user
exports.loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        // Check if the user exists by either username or email
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or username' });
        }

        // Compare the plain password directly (no bcrypt comparison)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: 'Server error during login' });
    }
};
