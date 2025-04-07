const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  carId: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  rentPerDay: { type: Number, required: true },
  fuelCostPerKm: { type: Number, required: true },
  passengerCount: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  isBooked: { type: Boolean, default: false }, // ✅ Make sure this is included
});

module.exports = mongoose.model("Car", CarSchema);
