const Car = require("../models/car");
const cloudinary = require("../config/cloudinaryConfig");

// --------------------
// Helper: Delete image from Cloudinary
// --------------------
const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const segments = imageUrl.split("/");
    const filenameWithExt = segments[segments.length - 1];
    const publicId = `car_rental/${filenameWithExt.split(".")[0]}`;

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted old image from Cloudinary:", result);
  } catch (err) {
    console.error("Error deleting image from Cloudinary:", err);
  }
};

// --------------------
// Add a new car
// --------------------
const addCar = async (req, res) => {
  try {
    const {
      carId,
      model,
      rentPerDay,
      longPeriodRentPerDay,
      weddingPurposeExtra,
      fuelCostPerKm,
      passengerCount,
    } = req.body;

    if (!req.file) return res.status(400).json({ message: "Car image is required" });

    const existingCar = await Car.findOne({ carId });
    if (existingCar) return res.status(400).json({ message: "Car ID already exists" });

    const imageUrl = req.file.path;
    const newCar = new Car({
      carId,
      model,
      rentPerDay,
      longPeriodRentPerDay,
      weddingPurposeExtra,
      fuelCostPerKm,
      passengerCount,
      imageUrl,
    });

    await newCar.save();
    res.status(201).json({ message: "Car added successfully", data: newCar });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ message: "Error adding car", error });
  }
};

// --------------------
// Get all cars
// --------------------
const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({ success: true, data: cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Error fetching cars", error });
  }
};

// --------------------
// Update car
// --------------------
const updateCar = async (req, res) => {
  const { id } = req.params;

  try {
    const existingCar = await Car.findById(id);
    if (!existingCar) return res.status(404).json({ message: "Car not found" });

    const {
      model,
      rentPerDay,
      longPeriodRentPerDay,
      weddingPurposeExtra,
      fuelCostPerKm,
      passengerCount,
    } = req.body;

    if (req.file) {
      if (existingCar.imageUrl) await deleteImageFromCloudinary(existingCar.imageUrl);
      existingCar.imageUrl = req.file.path;
    }

    existingCar.model = model ?? existingCar.model;
    existingCar.rentPerDay = rentPerDay ?? existingCar.rentPerDay;
    existingCar.longPeriodRentPerDay = longPeriodRentPerDay ?? existingCar.longPeriodRentPerDay;
    existingCar.weddingPurposeExtra = weddingPurposeExtra ?? existingCar.weddingPurposeExtra;
    existingCar.fuelCostPerKm = fuelCostPerKm ?? existingCar.fuelCostPerKm;
    existingCar.passengerCount = passengerCount ?? existingCar.passengerCount;

    const updatedCar = await existingCar.save();
    res.status(200).json({ message: "Car updated successfully", data: updatedCar });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ message: "Error updating car", error });
  }
};

// --------------------
// Delete car
// --------------------
const deleteCar = async (req, res) => {
  const { id } = req.params;

  try {
    const existingCar = await Car.findById(id);
    if (!existingCar) return res.status(404).json({ message: "Car not found" });

    if (existingCar.imageUrl) await deleteImageFromCloudinary(existingCar.imageUrl);

    await Car.findByIdAndDelete(id);
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Error deleting car", error });
  }
};

module.exports = { addCar, getCars, updateCar, deleteCar };
