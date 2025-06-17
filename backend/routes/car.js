const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const Booking = require("../models/Booking"); // Add this import

//  Add a car
router.post("/add", async (req, res) => {
  try {
    console.log("Received request to add car:", req.body);
    
    const { carId, model, rentPerDay, fuelCostPerKm, passengerCount, imageUrl } = req.body;
    
    if (!carId || !model || !rentPerDay || !fuelCostPerKm || !passengerCount || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if the car already exists
    const existingCar = await Car.findOne({ carId });
    if (existingCar) {
      return res.status(400).json({ message: "Car ID already exists" });
    }
    
    // Create a new car entry
    const newCar = new Car({ carId, model, rentPerDay, fuelCostPerKm, passengerCount, imageUrl });
    await newCar.save();
    
    res.status(201).json({ message: "Car added successfully!", car: newCar });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

//  GET all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
});

//  GET bookings for a specific car (for availability checking)
router.get("/:carId/bookings", async (req, res) => {
  try {
    const { carId } = req.params;
    
    // Find the car first to get its ObjectId
    const car = await Car.findOne({ carId });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    
    // Find all confirmed bookings for this car
    const bookings = await Booking.find({ 
      car: car._id, // Use the ObjectId from the car document
      status: 'confirmed',
      endDate: { $gte: new Date() } // Only future and current bookings
    }).select('startDate endDate');
    
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching car bookings:", error);
    res.status(500).json({ message: "Error fetching car bookings" });
  }
});

//  GET a single car
router.get("/:carId", async (req, res) => {
  try {
    console.log(`Fetching car with ID: ${req.params.carId}`);
    const car = await Car.findOne({ carId: req.params.carId });
    
    if (!car) {
      console.log('Car not found in database');
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    console.log('Car found:', car);
    res.json({
      success: true,
      data: car
    });
    
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching car'
    });
  }
});

//  Update Car by ID
router.put("/:carId", async (req, res) => {
  try {
    const { model, rentPerDay, fuelCostPerKm, passengerCount, imageUrl } = req.body;
    
    const updatedCar = await Car.findOneAndUpdate(
      { carId: req.params.carId }, 
      { model, rentPerDay, fuelCostPerKm, passengerCount, imageUrl }, 
      { new: true }
    );
    
    if (!updatedCar) return res.status(404).json({ message: "Car not found" });
    
    res.json({ message: "Car updated successfully", updatedCar });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//  DELETE car
router.delete("/:carId", async (req, res) => {
  try {
    const deletedCar = await Car.findOneAndDelete({ carId: req.params.carId });
    if (!deletedCar) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car" });
  }
});

module.exports = router;