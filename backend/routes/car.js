const express = require("express");
const router = express.Router();
const Car = require("../models/Car");


// ✅ Add a car
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
// ✅ GET all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
});

// ✅ GET a single car
router.get("/:carId", async (req, res) => {
  try {
    const car = await Car.findOne({ carId: req.params.carId });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car details" });
  }
});

/// ✅ Update Car by ID
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


// ✅ DELETE car
router.delete("/:carId", async (req, res) => {
  try {
    const deletedCar = await Car.findOneAndDelete({ carId: req.params.carId });
    if (!deletedCar) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car" });
  }
});

// ✅ Update isBooked status for a car
router.put("/book/:carId", async (req, res) => {
  try {
    const { isBooked } = req.body;
    console.log(`🔍 Booking request received for Car ID: ${req.params.carId}, isBooked: ${isBooked}`);

    const updatedCar = await Car.findOneAndUpdate(
      { carId: req.params.carId },
      { isBooked },
      { new: true }
    );

    if (!updatedCar) {
      console.log("❌ Car not found!");
      return res.status(404).json({ message: "Car not found" });
    }

    console.log("✅ Booking status updated:", updatedCar);
    res.json({ message: "Car booking status updated", updatedCar });
  } catch (error) {
    console.error("🚨 Error updating car booking status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
