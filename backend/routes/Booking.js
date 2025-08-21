// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
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

    // ✅ Save booking with PENDING status
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
      upfrontPayment,
      status: 'pending' // ✅ PENDING until payment confirmation
    });

    await newBooking.save();
    console.log('Booking created with pending status:', newBooking._id);

    res.status(201).json({
      message: 'Booking created successfully! Please proceed to payment.',
      booking: newBooking
    });
   
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Booking failed. Server error.' });
  }
});

// ✅ Confirm booking after successful payment
router.put('/confirm/:id', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const booking = await Booking.findById(req.params.id).populate('car');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status to confirmed
    booking.status = 'confirmed';
    booking.paymentIntentId = paymentIntentId;
    await booking.save();

    // Send confirmation email
    sendBookingConfirmationEmail(booking.email, booking.name, booking, booking.car)
      .then(() => console.log(`📧 Booking confirmation email sent to ${booking.email}`))
      .catch(err => console.error("❌ Email sending failed:", err));

    res.json({
      message: 'Booking confirmed successfully!',
      booking: booking
    });

  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Error confirming booking' });
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
      status: 'confirmed', // Only confirmed bookings
      endDate: { $gte: new Date() }
    }).select('startDate endDate');

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching car bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ Admin - get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('car');
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// ✅ Get bookings by email
router.get('/email/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      email: req.params.email,
      status: 'confirmed' // Only show confirmed bookings to users
    }).populate('car');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings by email:', error);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
});

// ✅ Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;