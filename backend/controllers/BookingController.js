const Booking = require('../models/Booking');
const Car = require('../models/Car');


const createBooking = async (req, res) => {
  try {
    const {
      carId,
      startDate,
      endDate,
      driverOption,
      specialMention,
      phoneNumber,
      alternatePhone,
      totalPrice
    } = req.body;

    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds

    // Optionally simulate failure
    if (Math.random() < 0.1) {
      return res.status(400).json({ message: 'Payment failed. Please try again.' });
    }
    

    const newBooking = new Booking({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      driverOption,
      specialMention,
      phoneNumber,
      alternatePhone,
      totalPrice,
      status: 'confirmed'
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking confirmed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Booking failed. Server error.' });
  }
};

module.exports = { createBooking };
