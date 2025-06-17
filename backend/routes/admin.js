const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    getAdminDetails,
    updateAdmin,
    deleteAdmin
} = require('../controllers/adminController');

const authenticateAdmin = require('../middleware/authenticateAdmin');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// New routes for authenticated admin
router.get('/me', authenticateAdmin, getAdminDetails);
router.put('/update', authenticateAdmin, updateAdmin);
router.delete('/delete', authenticateAdmin, deleteAdmin);

module.exports = router;
