const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    getAdminDetails,
    updateAdmin,
    deleteAdmin,
    changeAdminPassword // NEW
} = require('../controllers/adminController');

const authenticateAdmin = require('../middleware/authenticateAdmin');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Authenticated admin routes
router.get('/me', authenticateAdmin, getAdminDetails);
router.put('/update', authenticateAdmin, updateAdmin);
router.post('/change-password', authenticateAdmin, changeAdminPassword); // NEW
router.delete('/delete', authenticateAdmin, deleteAdmin);

module.exports = router;
