const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
