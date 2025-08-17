const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { sendBookingConfirmationEmail } = require('../utils/mailer');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      car, // ObjectId from frontend
      name,
      email,
      phone,
      altPhone,
      startDate,
      endDate,
      withDriver,
      totalAmount
    } = req.body;

    console.log('Creating booking for car:', car, 'from', startDate, 'to', endDate);

    // Check for date conflicts
    const existingBookings = await Booking.find({
      car: car,
      status: 'confirmed',
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Selected dates conflict with existing bookings. Please choose different dates.' 
      });
    }

    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Optionally simulate failure
    if (Math.random() < 0.1) {
      return res.status(400).json({ message: 'Payment failed. Please try again.' });
    }
    
    const newBooking = new Booking({
      car: car,
      name,
      email,
      phone,
      altPhone,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      withDriver,
      totalAmount,
      status: 'confirmed'
    });

    await newBooking.save();
    console.log('Booking created successfully:', newBooking._id);

    // Fetch car details for email
    const carDetails = await Car.findById(car);

    // Send confirmation email
    sendBookingConfirmationEmail(email, name, newBooking, carDetails)
      .then(() => console.log(`📧 Booking confirmation email sent to ${email}`))
      .catch(err => console.error("❌ Email sending failed:", err));

    res.status(201).json({ message: 'Booking confirmed successfully!' });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Booking failed. Server error.' });
  }
});

// GET bookings for a specific car
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

// Admin - get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('car');
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get bookings by user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('car');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
});

// Get bookings by email
router.get('/email/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.params.email }).populate('car');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings by email:', error);
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
});

// Delete booking
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
