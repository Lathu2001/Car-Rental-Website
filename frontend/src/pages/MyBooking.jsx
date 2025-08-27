import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config/api';

import {
  Calendar,
  Car,
  User,
  CreditCard,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Heart,
  Shield,
  Star,
  Mail,
  Banknote,
  Wallet,
  Receipt
} from 'lucide-react';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userResponse = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userResponse.json();
        const email = userData.email;
        setUserEmail(email);

        const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings/email/${email}`);
        const bookingData = await bookingResponse.json();

        const enhancedBookings = bookingData.map((booking) => ({
          ...booking,
          paymentMethod: booking.paymentMethod || 'card',
          amountPaid: booking.amountPaid || booking.totalAmount * 0.3,
          remainingAmount: booking.remainingAmount || booking.totalAmount * 0.7,
          paymentStatus: booking.paymentStatus || 'partial',
          weddingPackage: booking.weddingPurpose || false,
          bookingStatus: booking.bookingStatus || 'confirmed',
          paymentHistory:
            booking.paymentHistory ||
            [
              {
                date: booking.createdAt || new Date(),
                amount: booking.totalAmount * 0.3,
                method: 'card',
                status: 'completed',
                reference: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
              }
            ]
        }));

        setBookings(enhancedBookings);
      } catch (error) {
        console.error('Error fetching user or bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, []);

  const getPaymentStatusBadge = (status, amountPaid, totalAmount) => {
    const percentage = (amountPaid / totalAmount) * 100;

    if (percentage >= 100) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Fully Paid
        </span>
      );
    } else if (percentage >= 30) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-1" />
          Partially Paid ({Math.round(percentage)}%)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-4 h-4 mr-1" />
          Payment Pending
        </span>
      );
    }
  };

  const getBookingStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Confirmed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Cancelled' },
      completed: { color: 'bg-blue-100 text-blue-800', icon: Star, label: 'Completed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'cash':
        return <Banknote className="w-4 h-4" />;
      case 'bank':
        return <Wallet className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white backdrop-blur-lg rounded-full mb-6 animate-spin shadow-lg border">
            <Car className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Loading your bookings...</h2>
          <p className="text-gray-700">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background (hidden on small screens for performance) */}
      <div className="absolute inset-0 hidden lg:block">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/80 backdrop-blur-lg rounded-full mb-4 sm:mb-6 shadow-xl border border-white/20">
            <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-gray-700 text-base sm:text-lg lg:text-xl mb-4 sm:mb-6">
            Manage your rental history and upcoming trips
          </p>
          {userEmail && (
            <div className="inline-flex items-center bg-white/80 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-white/20">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3" />
              <span className="text-gray-800 text-sm sm:text-base font-medium">{userEmail}</span>
            </div>
          )}
        </div>

        {/* Bookings Content */}
        {bookings.length === 0 ? (
          <div className="text-center">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-lg mx-auto border border-white/20 shadow-xl">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <Car className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">No Bookings Yet</h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                You haven't made any bookings yet. Start exploring our premium fleet and book your first adventure!
              </p>
              <a
                href="/car"
                className="inline-block mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Browse Vehicles
              </a>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {bookings.map((booking, index) => (
              <div
                key={booking._id}
                className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Booking Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 sm:p-8 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-lg">
                        <Car className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                          {booking.car?.model || 'Vehicle'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            ID: {booking.car?.carId}
                          </span>
                          {booking.weddingPackage && (
                            <span className="flex items-center text-pink-600">
                              <Heart className="w-4 h-4 mr-1" />
                              Wedding Package
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      {getBookingStatusBadge(booking.bookingStatus)}
                      {getPaymentStatusBadge(booking.paymentStatus, booking.amountPaid, booking.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-5 sm:p-8">
                  {/* Date and Service Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-3">
                          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-blue-800">Start Date</p>
                          <p className="text-base sm:text-lg font-bold text-blue-900">
                            {new Date(booking.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:6 border border-purple-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-3">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-purple-800">End Date</p>
                          <p className="text-base sm:text-lg font-bold text-purple-900">
                            {new Date(booking.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-3">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-green-800">Driver Service</p>
                          <div className="mt-1">
                            <span
                              className={`inline-flex px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                                booking.withDriver ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'
                              }`}
                            >
                              {booking.withDriver ? 'Professional Driver' : 'Self Drive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-3">
                          {getPaymentMethodIcon(booking.paymentMethod)}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-indigo-800">Payment Method</p>
                          <p className="text-base sm:text-lg font-bold text-indigo-900 capitalize">
                            {booking.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200 mb-6 sm:mb-8">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" />
                      Payment Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                          Rs. {booking.totalAmount.toLocaleString()}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Amount Paid</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">
                          Rs. {booking.amountPaid.toLocaleString()}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          {Math.round((booking.amountPaid / booking.totalAmount) * 100)}% of total
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Remaining Balance</p>
                        <p
                          className={`text-2xl sm:text-3xl font-bold ${
                            booking.remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'
                          }`}
                        >
                          Rs. {booking.remainingAmount.toLocaleString()}
                        </p>
                        {booking.remainingAmount > 0 && (
                          <p className="text-[10px] sm:text-xs text-orange-600 mt-1">Due at pickup</p>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 sm:mt-6">
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                        <span>Payment Progress</span>
                        <span>{Math.round((booking.amountPaid / booking.totalAmount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 sm:h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min((booking.amountPaid / booking.totalAmount) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Premium Services */}
                  {(booking.withDriver || booking.weddingPackage) && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-amber-200">
                      <h4 className="text-base sm:text-lg font-bold text-amber-900 mb-3 sm:mb-4 flex items-center">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Premium Services
                      </h4>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {booking.withDriver && (
                          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                            <Shield className="w-4 h-4 mr-2" />
                            Professional Driver Included
                          </span>
                        )}
                        {booking.weddingPackage && (
                          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 bg-pink-100 text-pink-800 rounded-full text-xs sm:text-sm font-medium">
                            <Heart className="w-4 h-4 mr-2" />
                            Wedding Special Package
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom gradient fade (subtle) */}
      <div className="absolute bottom-0 left-0 w-full h-20 sm:h-32 bg-gradient-to-t from-white/20 to-transparent" />
    </div>
  );
}

export default MyBookings;
