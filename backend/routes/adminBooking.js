// routes/adminBooking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const auth = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// ✅ Create admin booking (cash payment)
router.post('/bookings', async (req, res) => {
  try {
    const {
      car,
      name,
      email,
      phone,
      altPhone,
      startDate,
      endDate,
      withDriver,
      weddingPurpose,
      totalAmount,
      paidAmount = 0,
      paymentMethod = 'cash',
      notes,
      status = 'confirmed' // Admin bookings are confirmed by default
    } = req.body;

    // Validate required fields
    if (!car || !name || !phone || !startDate || !endDate || !totalAmount) {
      return res.status(400).json({
        message: 'Missing required fields: car, name, phone, startDate, endDate, totalAmount'
      });
    }

    // Validate car exists
    const selectedCar = await Car.findById(car);
    if (!selectedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if car is available for selected dates
    const conflictingBookings = await Booking.find({
      car: car,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        message: 'Car is not available for the selected dates',
        conflictingBookings: conflictingBookings.map(booking => ({
          id: booking._id,
          startDate: booking.startDate,
          endDate: booking.endDate,
          customerName: booking.name
        }))
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (end < start) {
      return res.status(400).json({ message: 'End date must be on or after start date' });
    }

    // Validate payment amount
    if (paidAmount < 0) {
      return res.status(400).json({ message: 'Paid amount cannot be negative' });
    }

    if (paidAmount > totalAmount) {
      return res.status(400).json({ message: 'Paid amount cannot exceed total amount' });
    }

    // Create booking
    const booking = new Booking({
      car,
      name,
      email: email || '', // Email is optional for admin bookings
      phone,
      altPhone,
      startDate: start,
      endDate: end,
      withDriver: withDriver || false,
      weddingPurpose: weddingPurpose || false,
      totalAmount,
      paidAmount,
      paymentMethod,
      status,
      notes,
      isAdminBooking: true,
      upfrontPayment: paidAmount // For compatibility
    });

    await booking.save();

    // Populate car details for response
    await booking.populate('car');

    res.status(201).json({
      message: 'Admin booking created successfully',
      booking: booking,
      paymentSummary: {
        totalAmount: booking.totalAmount,
        paidAmount: booking.paidAmount,
        remainingAmount: booking.remainingAmount,
        paymentCompletionPercentage: booking.paymentCompletionPercentage,
        isFullyPaid: booking.isFullyPaid
      }
    });

  } catch (error) {
    console.error('Admin booking creation error:', error);
    res.status(500).json({
      message: 'Error creating admin booking',
      error: error.message
    });
  }
});

// ✅ Get all admin bookings with filters
router.get('/bookings', async (req, res) => {
  try {
    const {
      status,
      paymentMethod,
      startDate,
      endDate,
      carId,
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = { isAdminBooking: true };

    if (status) {
      filter.status = status;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (carId) {
      filter.car = carId;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    // Search filter (name, phone, or car registration)
    if (search) {
      const cars = await Car.find({
        $or: [
          { model: { $regex: search, $options: 'i' } },
          { carId: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const carIds = cars.map(car => car._id);

      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { car: { $in: carIds } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('car', 'model carId imageUrl rentPerDay')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// ✅ Get single admin booking
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      booking,
      paymentSummary: {
        totalAmount: booking.totalAmount,
        paidAmount: booking.paidAmount,
        remainingAmount: booking.remainingAmount,
        paymentCompletionPercentage: booking.paymentCompletionPercentage,
        isFullyPaid: booking.isFullyPaid
      }
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// ✅ Update admin booking
router.put('/bookings/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updates = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If updating dates, check availability
    if (updates.startDate || updates.endDate) {
      const newStartDate = updates.startDate ? new Date(updates.startDate) : booking.startDate;
      const newEndDate = updates.endDate ? new Date(updates.endDate) : booking.endDate;

      const conflictingBookings = await Booking.find({
        _id: { $ne: bookingId }, // Exclude current booking
        car: booking.car,
        status: { $in: ['confirmed', 'pending'] },
        $or: [
          {
            startDate: { $lte: newEndDate },
            endDate: { $gte: newStartDate }
          }
        ]
      });

      if (conflictingBookings.length > 0) {
        return res.status(400).json({
          message: 'Car is not available for the updated dates',
          conflictingBookings: conflictingBookings.map(b => ({
            id: b._id,
            startDate: b.startDate,
            endDate: b.endDate,
            customerName: b.name
          }))
        });
      }
    }

    // Update the booking
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        booking[key] = updates[key];
      }
    });

    booking.updatedAt = new Date();
    await booking.save();
    await booking.populate('car');

    res.json({
      message: 'Booking updated successfully',
      booking,
      paymentSummary: {
        totalAmount: booking.totalAmount,
        paidAmount: booking.paidAmount,
        remainingAmount: booking.remainingAmount,
        paymentCompletionPercentage: booking.paymentCompletionPercentage,
        isFullyPaid: booking.isFullyPaid
      }
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      message: 'Error updating booking',
      error: error.message
    });
  }
});

// ✅ Add payment to existing booking
router.post('/bookings/:id/payment', async (req, res) => {
  try {
    const { amount, paymentMethod = 'cash', notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if payment would exceed total
    const newPaidAmount = booking.paidAmount + amount;
    if (newPaidAmount > booking.totalAmount) {
      return res.status(400).json({ 
        message: 'Payment amount would exceed total booking amount',
        currentPaid: booking.paidAmount,
        totalAmount: booking.totalAmount,
        maxAllowed: booking.totalAmount - booking.paidAmount
      });
    }

    // Add payment
    await booking.addPayment(amount, paymentMethod);

    // Add payment notes if provided
    if (notes) {
      booking.notes = booking.notes ? `${booking.notes}\n\nPayment Note: ${notes}` : `Payment Note: ${notes}`;
      await booking.save();
    }

    await booking.populate('car');

    res.json({
      message: 'Payment added successfully',
      booking,
      paymentSummary: {
        totalAmount: booking.totalAmount,
        paidAmount: booking.paidAmount,
        remainingAmount: booking.remainingAmount,
        paymentCompletionPercentage: booking.paymentCompletionPercentage,
        isFullyPaid: booking.isFullyPaid
      }
    });

  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({
      message: 'Error adding payment',
      error: error.message
    });
  }
});

// ✅ Cancel admin booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

// ✅ Get payment summary/statistics
router.get('/stats/payments', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get payment statistics
    const stats = await Booking.aggregate([
      {
        $match: {
          isAdminBooking: true,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$paidAmount' },
          totalPending: { $sum: '$remainingAmount' },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    // Payment method breakdown
    const paymentMethodStats = await Booking.aggregate([
      {
        $match: {
          isAdminBooking: true,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$paidAmount' }
        }
      }
    ]);

    res.json({
      summary: stats[0] || {
        totalBookings: 0,
        totalRevenue: 0,
        totalPaid: 0,
        totalPending: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0
      },
      paymentMethods: paymentMethodStats
    });

  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({
      message: 'Error fetching payment statistics',
      error: error.message
    });
  }
});

module.exports = router;