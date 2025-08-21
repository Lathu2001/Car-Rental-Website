const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  carId: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  rentPerDay: { type: Number, required: true },
  longPeriodRentPerDay: { type: Number, required: true },
  weddingPurposeExtra: { type: Number, default: 0 },
  fuelCostPerKm: { type: Number, required: true },
  passengerCount: { type: Number, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.models.Car || mongoose.model("Car", CarSchema);