// routes/bookings.js - Updated with booking history functionality
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const BookingHistory = require('../models/BookingHistory'); // Add this import
const Car = require('../models/car');
const { sendBookingConfirmationEmail } = require('../utils/mailer');

// ✅ Create a new booking (PENDING status until payment)
router.post('/', async (req, res) => {
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
      weddingPurpose
    } = req.body;

    console.log('Creating booking for car:', car, 'from', startDate, 'to', endDate);

    const carDetails = await Car.findById(car);
    if (!carDetails) {
      return res.status(404).json({ message: "Car not found" });
    }

    // ✅ Date calculation (same-day = 1 day)
    const start = new Date(startDate);
    const end = new Date(endDate);
    let dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (dayCount < 1) dayCount = 1;

    // ✅ Daily rent selection
    let dailyRate = carDetails.rentPerDay;
    if (dayCount > 30) {
      dailyRate = carDetails.longPeriodRentPerDay;
    }

    // ✅ Base total
    let totalPrice = dayCount * dailyRate;

    // ✅ Add driver cost
    if (withDriver) {
      totalPrice += 2500 * dayCount;
    }

    // ✅ Add wedding extra
    if (weddingPurpose) {
      totalPrice += carDetails.weddingPurposeExtra;
    }

    // ✅ Only 30% upfront payment
    const upfrontPayment = Math.round(totalPrice * 0.3);

    // ✅ Check conflicts (only with confirmed bookings)
    const existingBookings = await Booking.find({
      car: car,
      status: 'confirmed',
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        message: 'Selected dates conflict with existing bookings. Please choose different dates.'
      });
    }

    // ✅ Save booking with PENDING status using new model fields
    const newBooking = new Booking({
      car,
      name,
      email,
      phone,
      altPhone,
      startDate: start,
      endDate: end,
      withDriver,
      weddingPurpose: weddingPurpose || false,
      totalAmount: totalPrice,
      paidAmount: 0, // Using new field
      upfrontPayment, // Keep for compatibility
      paymentMethod: 'cash', // Default
      status: 'pending',
      isAdminBooking: false
    });

    await newBooking.save();
    console.log('Booking created with pending status:', newBooking._id);

    res.status(201).json({
      message: 'Booking created successfully! Please proceed to payment.',
      booking: newBooking,
      paymentDetails: {
        totalAmount: totalPrice,
        depositAmount: upfrontPayment,
        remainingAmount: totalPrice - upfrontPayment
      }
    });
   
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Booking failed. Server error.' });
  }
});

// ✅ Confirm booking after successful payment
router.put('/confirm/:id', async (req, res) => {
  try {
    const { paymentIntentId, paidAmount, paymentMethod = 'card', status = 'confirmed' } = req.body;
    
    const booking = await Booking.findById(req.params.id).populate('car');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking with payment details
    booking.status = status;
    booking.paymentIntentId = paymentIntentId;
    booking.paidAmount = paidAmount || booking.paidAmount;
    booking.paymentMethod = paymentMethod;
    booking.updatedAt = new Date();

    await booking.save();

    console.log(`Booking ${booking._id} confirmed with payment:`, {
      paymentIntentId,
      paidAmount: booking.paidAmount,
      paymentMethod
    });

    // Send confirmation email
    if (booking.email) {
      sendBookingConfirmationEmail(booking.email, booking.name, booking, booking.car)
        .then(() => console.log(`📧 Booking confirmation email sent to ${booking.email}`))
        .catch(err => console.error("❌ Email sending failed:", err));
    }

    res.json({
      message: 'Booking confirmed successfully!',
      booking: booking
    });

  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Error confirming booking' });
  }
});

// 🆕 NEW: Finish booking - Move to history and delete from active bookings
router.post('/:id/finish', async (req, res) => {
  try {
    // Find the booking to finish
    const booking = await Booking.findById(req.params.id).populate('car');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    console.log(`Finishing booking ${booking._id} for car ${booking.car?.model}`);

    // Create history record with only required fields
    const historyData = {
      bookingId: booking._id,
      car: booking.car._id,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      altPhone: booking.altPhone,
      startDate: booking.startDate,
      endDate: booking.endDate,
      withDriver: booking.withDriver || false,
      weddingPurpose: booking.weddingPurpose || false,
      totalAmount: booking.totalAmount,
      completedAt: new Date()
    };

    // Save to booking history
    const history = new BookingHistory(historyData);
    await history.save();
    console.log(`Booking moved to history with ID: ${history._id}`);

    // Delete the original booking
    await Booking.findByIdAndDelete(req.params.id);
    console.log(`Original booking ${booking._id} deleted from active bookings`);

    res.json({ 
      message: 'Booking finished successfully and moved to history',
      historyId: history._id
    });
    
  } catch (error) {
    console.error('Error finishing booking:', error);
    res.status(500).json({ 
      message: 'Server error while finishing booking',
      error: error.message 
    });
  }
});

// ✅ GET bookings for a specific car (only confirmed)
router.get("/car/:carId", async (req, res) => {
  try {
    const { carId } = req.params;
    const car = await Car.findOne({ carId });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const bookings = await Booking.find({
      car: car._id,
      status: 'confirmed',
      endDate: { $gte: new Date() }
    }).select('startDate endDate');

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching car bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ Admin - get all bookings (SIMPLIFIED)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all bookings...');
    
    const bookings = await Booking.find()
      .populate('car')
      .sort({ createdAt: -1 })
      .exec();
    
    console.log(`Found ${bookings.length} bookings`);
    
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: error.message 
    });
  }
});

// ✅ Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      message: 'Error fetching booking',
      error: error.message 
    });
  }
});

// ✅ Get bookings by email
router.get('/email/:email', async (req, res) => {
  try {
    console.log('Fetching bookings for email:', req.params.email);
    
    const bookings = await Booking.find({ 
      email: req.params.email,
      status: { $in: ['confirmed', 'completed'] }
    }).populate('car').sort({ createdAt: -1 });
    
    console.log(`Found ${bookings.length} bookings for ${req.params.email}`);
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings by email:', error);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
});

// ✅ Add payment to existing booking
router.post('/:id/add-payment', async (req, res) => {
  try {
    const { amount, paymentMethod = 'cash' } = req.body;

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
    await booking.populate('car');

    res.json({
      message: 'Payment added successfully',
      booking: booking
    });

  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ 
      message: 'Error adding payment',
      error: error.message 
    });
  }
});

// ✅ Delete booking - Updated to handle both scenarios
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    console.log(`Deleting booking ${booking._id} permanently`);

    // Delete booking permanently (no history record)
    await Booking.findByIdAndDelete(req.params.id);
    
    console.log(`Booking ${req.params.id} deleted permanently`);
    res.json({ message: 'Booking deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ 
      message: 'Server error while deleting booking',
      error: error.message 
    });
  }
});

// 🆕 NEW: Update existing booking (for admin edits)
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('car');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    console.log(`Booking ${booking._id} updated successfully`);
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ 
      message: 'Error updating booking',
      error: error.message 
    });
  }
});

module.exports = router;