// models/Booking.js - Updated model
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  name: { type: String, required: true },
  email: { type: String, required: false }, // Made optional for admin bookings
  phone: { type: String, required: true },
  altPhone: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  withDriver: { type: Boolean, default: false },
  weddingPurpose: { type: Boolean, default: false },
  totalAmount: { type: Number, required: true },
  upfrontPayment: { type: Number, required: true }, // Keep for compatibility
  paidAmount: { type: Number, default: 0 }, // New field: actual amount customer paid
  remainingAmount: { type: Number, default: 0 }, // Calculated field
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'bank_transfer', 'check', 'online'], 
    default: 'cash' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  paymentIntentId: { type: String }, // For Stripe payments (keep for compatibility)
  notes: { type: String }, // Admin notes
  isAdminBooking: { type: Boolean, default: false }, // Track if created by admin
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to calculate remaining amount
BookingSchema.pre('save', function(next) {
  this.remainingAmount = this.totalAmount - this.paidAmount;
  this.updatedAt = Date.now();
  
  // For compatibility, set upfrontPayment to paidAmount
  if (this.paidAmount !== undefined) {
    this.upfrontPayment = this.paidAmount;
  }
  
  next();
});

// Virtual for payment completion percentage
BookingSchema.virtual('paymentCompletionPercentage').get(function() {
  if (this.totalAmount === 0) return 0;
  return Math.round((this.paidAmount / this.totalAmount) * 100);
});

// Virtual to check if fully paid
BookingSchema.virtual('isFullyPaid').get(function() {
  return this.paidAmount >= this.totalAmount;
});

// Method to add payment
BookingSchema.methods.addPayment = function(amount, method = 'cash') {
  this.paidAmount += amount;
  this.paymentMethod = method;
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'confirmed';
  }
  return this.save();
};

// Ensure virtuals are included in JSON output
BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Booking", BookingSchema);