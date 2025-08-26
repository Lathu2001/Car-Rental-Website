const mongoose = require('mongoose');

const BookingHistorySchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  altPhone: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  withDriver: { type: Boolean, default: false },
  weddingPurpose: { type: Boolean, default: false },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'cash' },
  notes: { type: String },
  isAdminBooking: { type: Boolean, default: false },
  completedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookingHistory', BookingHistorySchema);