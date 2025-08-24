const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
const Car = require("../models/car");

// ------------------
// Multer + Cloudinary Storage
// ------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "car_rental",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// ------------------
// Helper: Delete old image
// ------------------
const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) return false;
  try {
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1].split(".")[0];
    const publicId = `car_rental/${filename}`;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Image deletion result:", result);
    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
};

// ------------------
// Add a new car
// ------------------
router.post("/add", upload.single("image"), async (req, res) => {
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

    if (!carId || !model || !rentPerDay || !longPeriodRentPerDay || !fuelCostPerKm || !passengerCount || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCar = await Car.findOne({ carId });
    if (existingCar) return res.status(400).json({ message: "Car ID already exists" });

    const imageUrl = req.file.path;
    const newCar = new Car({
      carId,
      model,
      rentPerDay,
      longPeriodRentPerDay,
      weddingPurposeExtra: weddingPurposeExtra || 0,
      fuelCostPerKm,
      passengerCount,
      imageUrl,
    });

    await newCar.save();
    res.status(201).json({ message: "Car added successfully", data: newCar });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ------------------
// Get all cars
// ------------------
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
});

// ------------------
// Get single car by carId
// ------------------
router.get("/:carId", async (req, res) => {
  try {
    const car = await Car.findOne({ carId: req.params.carId });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ success: true, data: car });
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ success: false, message: "Server error while fetching car" });
  }
});

// ------------------
// Update car by carId (WITH OLD IMAGE DELETION)
// ------------------
router.put("/:carId", upload.single("image"), async (req, res) => {
  try {
    const {
      model,
      rentPerDay,
      longPeriodRentPerDay,
      weddingPurposeExtra,
      fuelCostPerKm,
      passengerCount,
    } = req.body;

    const existingCar = await Car.findOne({ carId: req.params.carId });
    if (!existingCar) return res.status(404).json({ message: "Car not found" });

    const updateData = {
      model,
      rentPerDay,
      longPeriodRentPerDay,
      weddingPurposeExtra,
      fuelCostPerKm,
      passengerCount,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // If a new image is uploaded, delete old image
    if (req.file) {
      if (existingCar.imageUrl) await deleteImageFromCloudinary(existingCar.imageUrl);
      updateData.imageUrl = req.file.path;
    }

    const updatedCar = await Car.findOneAndUpdate({ carId: req.params.carId }, updateData, { new: true });
    res.json({ message: "Car updated successfully", data: updatedCar });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------
// Delete car by carId (WITH IMAGE DELETION)
// ------------------
router.delete("/:carId", async (req, res) => {
  try {
    const carToDelete = await Car.findOne({ carId: req.params.carId });
    if (!carToDelete) return res.status(404).json({ message: "Car not found" });

    if (carToDelete.imageUrl) await deleteImageFromCloudinary(carToDelete.imageUrl);

    await Car.findOneAndDelete({ carId: req.params.carId });
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Error deleting car" });
  }
});

module.exports = router;
