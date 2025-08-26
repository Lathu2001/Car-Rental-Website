import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Phone,
  Mail,
  Banknote,
  Wallet,
  Receipt,
  Search,
  X,
  CreditCard as CardIcon,
  UserCheck
} from 'lucide-react';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [showWeddingOnly, setShowWeddingOnly] = useState(false);
  const [showWithDriverOnly, setShowWithDriverOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      
      const enhancedBookings = res.data.map(booking => ({
        ...booking,
        // Use the new model fields with fallbacks for compatibility
        amountPaid: booking.paidAmount || booking.upfrontPayment || 0,
        remainingAmount: booking.remainingAmount || (booking.totalAmount - (booking.paidAmount || booking.upfrontPayment || 0)),
        paymentStatus: getPaymentStatusFromAmount(booking.paidAmount || booking.upfrontPayment || 0, booking.totalAmount),
        bookingStatus: booking.status,
        paymentCompletionPercentage: booking.totalAmount > 0 ? Math.round(((booking.paidAmount || booking.upfrontPayment || 0) / booking.totalAmount) * 100) : 0,
        isFullyPaid: (booking.paidAmount || booking.upfrontPayment || 0) >= booking.totalAmount
      }));
      
      // Sort bookings by start date (earliest first)
      enhancedBookings.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      
      setBookings(enhancedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusFromAmount = (paidAmount, totalAmount) => {
    if (paidAmount >= totalAmount) return 'paid';
    if (paidAmount > 0) return 'partial';
    return 'pending';
  };

  const handleFinish = async (id) => {
    if (!window.confirm("Are you sure you want to complete this booking? This will move it to the booking history.")) return;

    try {
      // Update booking status to completed instead of deleting
      await axios.put(`http://localhost:5000/api/bookings/${id}`, { 
        status: 'completed',
        completedAt: new Date()
      });
      
      // Update the booking in local state
      setBookings(prev => prev.map(b =>
        b._id === id ? { ...b, status: 'completed', completedAt: new Date() } : b
      ));
    } catch (error) {
      console.error('Error completing booking:', error);
      alert('Failed to complete booking. Please try again.');
    }
  };

  // Filters for confirmed bookings only
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const filteredBookings = confirmedBookings.filter(booking => {
    const matchesSearch = search === '' || 
      (booking.car?.model && booking.car.model.toLowerCase().includes(search.toLowerCase())) ||
      (booking.name && booking.name.toLowerCase().includes(search.toLowerCase())) ||
      (booking.car?.carId && booking.car.carId.toLowerCase().includes(search.toLowerCase()));
    
    const matchesWeddingFilter = !showWeddingOnly || booking.weddingPurpose;
    const matchesDriverFilter = !showWithDriverOnly || booking.withDriver;
    
    return matchesSearch && matchesWeddingFilter && matchesDriverFilter;
  });

  // Completed bookings for history section
  const completedBookings = bookings.filter(b => b.status === 'completed')
    .sort((a, b) => new Date(b.completedAt || b.updatedAt || b.createdAt) - new Date(a.completedAt || a.updatedAt || a.createdAt));

  const getPaymentStatusBadge = (status, amountPaid, totalAmount) => {
    const percentage = (amountPaid / totalAmount) * 100;
    
    if (percentage >= 100) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Fully Paid
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-1" />
          Partial ({Math.round(percentage)}%)
        </span>
      );
    } 
  };

  const getBookingStatusBadge = (status) => {
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Confirmed
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Completed
        </span>
      );
    }
    return null;
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'cash': return <Banknote className="w-4 h-4" />;
      case 'bank_transfer': return <Wallet className="w-4 h-4" />;
      case 'check': return <Receipt className="w-4 h-4" />;
      case 'online': return <CardIcon className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const clearSearch = () => {
    setSearch('');
  };

  const toggleWeddingFilter = () => {
    setShowWeddingOnly(!showWeddingOnly);
  };

  const toggleDriverFilter = () => {
    setShowWithDriverOnly(!showWithDriverOnly);
  };

  const clearAllFilters = () => {
    setSearch('');
    setShowWeddingOnly(false);
    setShowWithDriverOnly(false);
  };

  const BookingCard = ({ booking, isCompleted = false }) => (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
              isCompleted 
                ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
                : 'bg-gradient-to-br from-green-500 to-emerald-500'
            }`}>
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{booking.car?.model}</h3>
              <p className="text-sm text-gray-600">ID: {booking.car?.carId} • {booking.name}</p>
            </div>
            {booking.weddingPurpose && (
              <Heart className="w-5 h-5 text-pink-500 ml-2" title="Wedding Booking" />
            )}
            {booking.withDriver && (
              <UserCheck className="w-5 h-5 text-blue-500 ml-2" title="With Driver" />
            )}
            {booking.isAdminBooking && (
              <Shield className="w-5 h-5 text-purple-500 ml-2" title="Admin Booking" />
            )}
          </div>
          
          <div className="flex gap-2">
            {getBookingStatusBadge(booking.bookingStatus)}
            {getPaymentStatusBadge(booking.paymentStatus, booking.amountPaid, booking.totalAmount)}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Customer */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Customer
              </h4>
              <div className="flex gap-2">
                {booking.withDriver && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    With Driver
                  </span>
                )}
                {!booking.withDriver && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    Self Drive
                  </span>
                )}
              </div>
            </div>
            <p className="text-base font-medium text-gray-900 mb-2">{booking.name}</p>
            <div className="space-y-1">
              {booking.email && (
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {booking.email}
                </p>
              )}
              <p className="text-sm text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {booking.phone}
              </p>
              {booking.altPhone && (
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {booking.altPhone} (Alt)
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-700 flex items-center mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              Duration
            </h4>
            <p className="text-base font-medium text-blue-900 mb-2">
              {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
            </p>
            <div className="space-y-1 text-sm text-blue-700">
              <p className="font-medium">Start: {new Date(booking.startDate).toLocaleDateString('en-GB')}</p>
              <p>End: {new Date(booking.endDate).toLocaleDateString('en-GB')}</p>
              {isCompleted && booking.completedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Completed: {new Date(booking.completedAt).toLocaleDateString('en-GB')}
                </p>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-green-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Payment
              </h4>
              <span className="text-sm text-green-600 flex items-center">
                {getPaymentMethodIcon(booking.paymentMethod)}
                <span className="ml-1 capitalize">{booking.paymentMethod?.replace('_', ' ')}</span>
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">Rs. {booking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paid:</span>
                <span className="font-medium text-green-600">Rs. {booking.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Balance:</span>
                <span className={`font-medium ${booking.remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  Rs. {booking.remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Payment Progress</span>
            <span>{booking.paymentCompletionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(booking.paymentCompletionPercentage, 100)}%`
              }}
            ></div>
          </div>
        </div>

        {/* Notes if available */}
        {booking.notes && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-1">Admin Notes:</p>
            <p className="text-sm text-yellow-700">{booking.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500 flex items-center gap-3">
            <span>Booking ID: {booking._id}</span>
            {booking.isAdminBooking && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                Admin Created
              </span>
            )}
            {booking.weddingPurpose && (
              <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                Wedding
              </span>
            )}
          </div>
          {!isCompleted ? (
            <button
              onClick={() => handleFinish(booking._id)}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none"
            >
              Complete Booking
            </button>
          ) : (
            <span className="px-5 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-semibold rounded-lg opacity-60 cursor-not-allowed">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white backdrop-blur-lg rounded-full mb-4 animate-spin shadow-lg border">
            <Receipt className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Loading bookings...</h2>
          <p className="text-gray-600 text-base">Please wait while we fetch all data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Confirmed Bookings Dashboard
            </h2>
            <p className="text-slate-600 text-base">Manage confirmed car rental bookings</p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by car model, customer name, or car ID..."
                className="w-full pl-12 pr-12 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-slate-700 placeholder-slate-400 text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-4 flex-wrap">
            <div 
              className={`rounded-lg p-3 text-white text-center min-w-[120px] cursor-pointer transition-all duration-300 ${
                !showWeddingOnly && !showWithDriverOnly
                  ? 'bg-gradient-to-br from-green-600 to-green-700 ring-2 ring-green-300' 
                  : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
              onClick={clearAllFilters}
            >
              <p className="text-xs text-green-100">Confirmed Bookings</p>
              <p className="text-xl font-bold">{confirmedBookings.length}</p>
              {!showWeddingOnly && !showWithDriverOnly && (
                <div className="mt-1">
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              )}
            </div>
            <div 
              className={`rounded-lg p-3 text-white text-center min-w-[120px] cursor-pointer transition-all duration-300 ${
                showWeddingOnly 
                  ? 'bg-gradient-to-br from-pink-600 to-pink-700 ring-2 ring-pink-300' 
                  : 'bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
              }`}
              onClick={toggleWeddingFilter}
            >
              <p className="text-xs text-pink-100">Wedding Bookings</p>
              <p className="text-xl font-bold">{confirmedBookings.filter(b => b.weddingPurpose).length}</p>
              {showWeddingOnly && (
                <div className="mt-1">
                  <span className="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              )}
            </div>
            <div 
              className={`rounded-lg p-3 text-white text-center min-w-[120px] cursor-pointer transition-all duration-300 ${
                showWithDriverOnly 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-300' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }`}
              onClick={toggleDriverFilter}
            >
              <p className="text-xs text-blue-100">With Driver</p>
              <p className="text-xl font-bold">{confirmedBookings.filter(b => b.withDriver).length}</p>
              {showWithDriverOnly && (
                <div className="mt-1">
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              )}
            </div>
            <div className="rounded-lg p-3 bg-gradient-to-br from-gray-500 to-gray-600 text-white text-center min-w-[120px]">
              <p className="text-xs text-gray-100">Completed</p>
              <p className="text-xl font-bold">{completedBookings.length}</p>
              <div className="mt-1">
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                  History
                </span>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(search || showWeddingOnly || showWithDriverOnly) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-blue-700 flex-wrap">
                  <span className="font-medium">Active filters:</span>
                  {search && (
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      Search: "{search}"
                    </span>
                  )}
                  {showWeddingOnly && (
                    <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded">
                      Wedding only
                    </span>
                  )}
                  {showWithDriverOnly && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      With driver only
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmed Bookings */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Bookings</h3>
        {filteredBookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-10 shadow-lg border border-white/20 text-center">
            <CheckCircle className="w-14 h-14 mx-auto mb-4 text-green-400" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No confirmed bookings found</h3>
            <p className="text-slate-500 text-base">
              {search || showWeddingOnly || showWithDriverOnly
                ? 'Try adjusting your search terms or filters' 
                : 'No confirmed bookings available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {/* Booking History */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h3>
        {completedBookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-10 shadow-lg border border-white/20 text-center">
            <Receipt className="w-14 h-14 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No completed bookings yet</h3>
            <p className="text-slate-500 text-base">
              Completed bookings will appear here for your records
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} isCompleted={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
