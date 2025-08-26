const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminDetails,
  updateAdmin,
  deleteAdmin,
  changeAdminPassword,
  forgotAdminPassword,     // NEW
  resetAdminPassword,      // NEW
} = require('../controllers/adminController');

const authenticateAdmin = require('../middleware/authenticateAdmin');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Password reset (public)
router.post('/forgot-password', forgotAdminPassword);     // NEW
router.post('/reset-password/:token', resetAdminPassword); // NEW

// Authenticated admin routes
router.get('/me', authenticateAdmin, getAdminDetails);
router.put('/update', authenticateAdmin, updateAdmin);
router.post('/change-password', authenticateAdmin, changeAdminPassword);
router.delete('/delete', authenticateAdmin, deleteAdmin);

module.exports = router;
