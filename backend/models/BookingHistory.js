// models/BookingHistory.js
const mongoose = require('mongoose');

const BookingHistorySchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  name: { type: String, required: true,trim: true},
  email: { type: String, trim: true, lowercase: true},
  phone: { type: String, required: true, trim: true},
  altPhone: { type: String, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  withDriver: { type: Boolean, default: false },
  weddingPurpose: { type: Boolean, default: false },
  totalAmount: { type: Number, required: true,min: 0 },
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true, // This will add createdAt and updatedAt
  collection: 'bookinghistories' // Explicit collection name
});

// Indexes for better query performance
BookingHistorySchema.index({ completedAt: -1 });
BookingHistorySchema.index({ email: 1 });
BookingHistorySchema.index({ bookingId: 1 });
BookingHistorySchema.index({ car: 1 });
BookingHistorySchema.index({ name: 1 });

// Virtual for booking duration
BookingHistorySchema.virtual('duration').get(function() {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
});

// Method to get formatted completion date
BookingHistorySchema.methods.getFormattedCompletionDate = function() {
  return this.completedAt.toLocaleDateString('en-GB');
};

// Method to get formatted date range
BookingHistorySchema.methods.getDateRange = function() {
  const start = this.startDate.toLocaleDateString('en-GB');
  const end = this.endDate.toLocaleDateString('en-GB');
  return `${start} - ${end}`;
};

// Static method to get history by date range
BookingHistorySchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    completedAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('car', 'model carId').sort({ completedAt: -1 });
};

// Static method to get revenue statistics
BookingHistorySchema.statics.getRevenueStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        averageBookingValue: { $avg: '$totalAmount' },
        totalBookings: { $sum: 1 },
        weddingBookings: {
          $sum: { $cond: [{ $eq: ['$weddingPurpose', true] }, 1, 0] }
        },
        driverBookings: {
          $sum: { $cond: [{ $eq: ['$withDriver', true] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats.length > 0 ? stats[0] : {
    totalRevenue: 0,
    averageBookingValue: 0,
    totalBookings: 0,
    weddingBookings: 0,
    driverBookings: 0
  };
};

// Pre-save middleware to ensure data consistency
BookingHistorySchema.pre('save', function(next) {
  // Ensure endDate is not before startDate
  if (this.endDate < this.startDate) {
    const error = new Error('End date cannot be before start date');
    return next(error);
  }
  
  // Ensure totalAmount is positive
  if (this.totalAmount < 0) {
    const error = new Error('Total amount cannot be negative');
    return next(error);
  }
  
  next();
});

// Ensure virtuals are included when converting to JSON
BookingHistorySchema.set('toJSON', { virtuals: true });
BookingHistorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('BookingHistory', BookingHistorySchema);