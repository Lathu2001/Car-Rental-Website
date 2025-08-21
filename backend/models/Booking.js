const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  altPhone: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  withDriver: { type: Boolean, default: false },
  weddingPurpose: { type: Boolean, default: false },
  totalAmount: { type: Number, required: true },
  upfrontPayment: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentIntentId: { type: String }, // Store Stripe payment intent ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);