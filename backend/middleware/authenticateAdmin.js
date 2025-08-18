const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.header('Authorization');

   

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        console.error("Admin token error:", error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateAdmin;
