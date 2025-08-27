// routes/bookingHistory.js
const express = require('express');
const router = express.Router();
const BookingHistory = require('../models/BookingHistory');

// ✅ Get all booking history
router.get('/', async (req, res) => {
  try {
    console.log('Fetching booking history...');
    
    const history = await BookingHistory.find()
      .populate('car', 'model carId')
      .sort({ completedAt: -1 })
      .exec();
    
    console.log(`Found ${history.length} history records`);
    res.json(history);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ 
      message: 'Server error while fetching booking history',
      error: error.message 
    });
  }
});

// ✅ Get booking history by ID
router.get('/:id', async (req, res) => {
  try {
    const history = await BookingHistory.findById(req.params.id)
      .populate('car', 'model carId');
    
    if (!history) {
      return res.status(404).json({ message: 'Booking history not found' });
    }
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ 
      message: 'Server error while fetching booking history',
      error: error.message 
    });
  }
});

// ✅ Get booking history by customer email
router.get('/email/:email', async (req, res) => {
  try {
    console.log('Fetching booking history for email:', req.params.email);
    
    const history = await BookingHistory.find({ 
      email: req.params.email 
    })
    .populate('car', 'model carId')
    .sort({ completedAt: -1 });
    
    console.log(`Found ${history.length} history records for ${req.params.email}`);
    res.json(history);
  } catch (error) {
    console.error('Error fetching booking history by email:', error);
    res.status(500).json({ 
      message: 'Error fetching user booking history',
      error: error.message 
    });
  }
});

// ✅ Get booking history statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalBookings = await BookingHistory.countDocuments();
    const weddingBookings = await BookingHistory.countDocuments({ weddingPurpose: true });
    const driverBookings = await BookingHistory.countDocuments({ withDriver: true });
    
    // Calculate total revenue from completed bookings
    const revenueResult = await BookingHistory.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    res.json({
      totalBookings,
      weddingBookings,
      driverBookings,
      totalRevenue,
      selfDriveBookings: totalBookings - driverBookings,
      regularBookings: totalBookings - weddingBookings
    });
  } catch (error) {
    console.error('Error fetching booking history stats:', error);
    res.status(500).json({ 
      message: 'Error fetching booking statistics',
      error: error.message 
    });
  }
});

// ✅ Delete booking history (for cleanup purposes only)
router.delete('/:id', async (req, res) => {
  try {
    const history = await BookingHistory.findByIdAndDelete(req.params.id);
    
    if (!history) {
      return res.status(404).json({ message: 'Booking history not found' });
    }
    
    console.log(`Booking history ${req.params.id} deleted`);
    res.json({ message: 'Booking history deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking history:', error);
    res.status(500).json({ 
      message: 'Error deleting booking history',
      error: error.message 
    });
  }
});

// ✅ Search booking history
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    console.log('Searching booking history for:', query);
    
    const history = await BookingHistory.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('car', 'model carId')
    .sort({ completedAt: -1 });
    
    console.log(`Found ${history.length} matching history records`);
    res.json(history);
  } catch (error) {
    console.error('Error searching booking history:', error);
    res.status(500).json({ 
      message: 'Error searching booking history',
      error: error.message 
    });
  }
});

module.exports = router;