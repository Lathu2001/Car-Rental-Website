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
  UserCheck,
  Trash2,
  History,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  MoreVertical,
  Calendar as CalendarIcon,
  FileText,
  Eye,
  EyeOff,
  AlertTriangle,
  XCircle
} from 'lucide-react';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [showWeddingOnly, setShowWeddingOnly] = useState(false);
  const [showWithDriverOnly, setShowWithDriverOnly] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [bulkDeletePeriod, setBulkDeletePeriod] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      
      const enhancedBookings = res.data.map(booking => ({
        ...booking,
        amountPaid: booking.paidAmount || booking.upfrontPayment || 0,
        remainingAmount: booking.remainingAmount || (booking.totalAmount - (booking.paidAmount || booking.upfrontPayment || 0)),
        paymentStatus: getPaymentStatusFromAmount(booking.paidAmount || booking.upfrontPayment || 0, booking.totalAmount),
        bookingStatus: booking.status,
        paymentCompletionPercentage: booking.totalAmount > 0 ? Math.round(((booking.paidAmount || booking.upfrontPayment || 0) / booking.totalAmount) * 100) : 0,
        isFullyPaid: (booking.paidAmount || booking.upfrontPayment || 0) >= booking.totalAmount
      }));
      
      enhancedBookings.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      setBookings(enhancedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingHistory = async () => {
    if (bookingHistory.length > 0) return;
    
    setHistoryLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/booking-history');
      setBookingHistory(res.data);
    } catch (error) {
      console.error('Error fetching booking history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getPaymentStatusFromAmount = (paidAmount, totalAmount) => {
    if (paidAmount >= totalAmount) return 'paid';
    if (paidAmount > 0) return 'partial';
    return 'pending';
  };

  const handleFinishBooking = async (id) => {
    const action = {
      type: 'finish',
      title: 'Finish Booking',
      message: 'Are you sure you want to finish this booking? This action will move it to history.',
      confirmText: 'Finish Booking',
      action: async () => {
        try {
          await axios.post(`http://localhost:5000/api/bookings/${id}/finish`);
          setBookings(prev => prev.filter(b => b._id !== id));
          setBookingHistory([]);
          showNotification('Booking finished and moved to history!', 'success');
        } catch (error) {
          console.error('Error finishing booking:', error);
          showNotification('Failed to finish booking. Please try again.', 'error');
        }
      }
    };
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const handleDeleteBooking = async (id) => {
    const action = {
      type: 'delete',
      title: 'Delete Booking',
      message: 'Are you sure you want to delete this booking? This action cannot be undone.',
      confirmText: 'Delete Booking',
      action: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/bookings/${id}`);
          setBookings(prev => prev.filter(b => b._id !== id));
          showNotification('Booking deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting booking:', error);
          showNotification('Failed to delete booking. Please try again.', 'error');
        }
      }
    };
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const handleBulkDeleteCancelled = async () => {
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
    
    if (cancelledBookings.length === 0) {
      showNotification('No cancelled bookings found to delete', 'info');
      return;
    }

    const action = {
      type: 'bulk_delete_cancelled',
      title: 'Delete All Cancelled Bookings',
      message: `Are you sure you want to delete all ${cancelledBookings.length} cancelled booking(s)? This action cannot be undone.`,
      confirmText: `Delete ${cancelledBookings.length} Cancelled Bookings`,
      action: async () => {
        try {
          const deletePromises = cancelledBookings.map(booking => 
            axios.delete(`http://localhost:5000/api/bookings/${booking._id}`)
          );
          
          await Promise.all(deletePromises);
          setBookings(prev => prev.filter(b => b.status !== 'cancelled'));
          showNotification(`${cancelledBookings.length} cancelled booking(s) deleted successfully!`, 'success');
        } catch (error) {
          console.error('Error bulk deleting cancelled bookings:', error);
          showNotification('Failed to delete cancelled bookings. Please try again.', 'error');
        }
      }
    };
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const handleBulkDeletePending = async () => {
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    
    if (pendingBookings.length === 0) {
      showNotification('No pending bookings found to delete', 'info');
      return;
    }

    const action = {
      type: 'bulk_delete_pending',
      title: 'Delete All Pending Bookings',
      message: `Are you sure you want to delete all ${pendingBookings.length} pending booking(s)? This action cannot be undone.`,
      confirmText: `Delete ${pendingBookings.length} Pending Bookings`,
      action: async () => {
        try {
          const deletePromises = pendingBookings.map(booking => 
            axios.delete(`http://localhost:5000/api/bookings/${booking._id}`)
          );
          
          await Promise.all(deletePromises);
          setBookings(prev => prev.filter(b => b.status !== 'pending'));
          showNotification(`${pendingBookings.length} pending booking(s) deleted successfully!`, 'success');
        } catch (error) {
          console.error('Error bulk deleting pending bookings:', error);
          showNotification('Failed to delete pending bookings. Please try again.', 'error');
        }
      }
    };
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const handleBulkDeleteByPeriod = async () => {
    if (!bulkDeletePeriod) return;

    const cutoffDate = new Date();
    switch(bulkDeletePeriod) {
      case '1month':
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        break;
      case '3months':
        cutoffDate.setMonth(cutoffDate.getMonth() - 3);
        break;
      case '6months':
        cutoffDate.setMonth(cutoffDate.getMonth() - 6);
        break;
      case '1year':
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        break;
      default:
        return;
    }

    const historyToDelete = bookingHistory.filter(booking => 
      new Date(booking.completedAt || booking.endDate) < cutoffDate
    );

    if (historyToDelete.length === 0) {
      showNotification('No history records found for the selected period', 'info');
      return;
    }

    const action = {
      type: 'bulk_delete_history',
      title: 'Delete Old History Records',
      message: `Are you sure you want to delete ${historyToDelete.length} old history record(s) from ${bulkDeletePeriod.replace(/(\d+)(\w+)/, '$1 $2')} ago? This action cannot be undone.`,
      confirmText: `Delete ${historyToDelete.length} Old Records`,
      action: async () => {
        try {
          const deletePromises = historyToDelete.map(booking => 
            axios.delete(`http://localhost:5000/api/booking-history/${booking._id}`)
          );
          
          await Promise.all(deletePromises);
          setBookingHistory(prev => prev.filter(booking => 
            !historyToDelete.some(deleted => deleted._id === booking._id)
          ));
          
          showNotification(`${historyToDelete.length} old history records deleted successfully!`, 'success');
          setBulkDeletePeriod(''); // Reset selection
        } catch (error) {
          console.error('Error bulk deleting history by period:', error);
          showNotification('Failed to delete old history records. Please try again.', 'error');
        }
      }
    };
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const downloadHistoryCSV = () => {
    if (bookingHistory.length === 0) {
      showNotification('No history data to download', 'warning');
      return;
    }

    const headers = [
      'Booking ID',
      'Customer Name', 
      'Email',
      'Phone',
      'Car Model',
      'Car ID',
      'Start Date',
      'End Date',
      'Duration (Days)',
      'Total Amount',
      'Payment Method',
      'Wedding Purpose',
      'With Driver',
      'Completed Date',
      'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...bookingHistory.map(booking => [
        booking._id || booking.bookingId || '',
        `"${booking.name || ''}"`,
        booking.email || '',
        booking.phone || '',
        `"${booking.car?.model || 'N/A'}"`,
        booking.car?.carId || '',
        new Date(booking.startDate).toLocaleDateString('en-GB'),
        new Date(booking.endDate).toLocaleDateString('en-GB'),
        Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) + 1,
        booking.totalAmount || 0,
        booking.paymentMethod || '',
        booking.weddingPurpose ? 'Yes' : 'No',
        booking.withDriver ? 'Yes' : 'No',
        booking.completedAt ? new Date(booking.completedAt).toLocaleDateString('en-GB') : '',
        `"${booking.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `booking-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('History downloaded successfully!', 'success');
  };

  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-black' :
      'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      fetchBookingHistory();
    }
  };

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const filteredBookings = confirmedBookings.filter(booking => {
    const matchesSearch = search === '' || 
      (booking.car?.model && booking.car.model.toLowerCase().includes(search.toLowerCase())) ||
      (booking.name && booking.name.toLowerCase().includes(search.toLowerCase())) ||
      (booking.car?.carId && booking.car.carId.toLowerCase().includes(search.toLowerCase()));
    
    const matchesWeddingFilter = !showWeddingOnly || booking.weddingPurpose;
    const matchesDriverFilter = !showWithDriverOnly || booking.withDriver;
    
    return matchesSearch && matchesWeddingFilter && matchesDriverFilter;
  });

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

  const ConfirmDialog = () => {
    if (!showConfirmDialog || !confirmAction) return null;

    const getDialogColor = () => {
      switch (confirmAction.type) {
        case 'delete':
        case 'bulk_delete_cancelled':
        case 'bulk_delete_pending':
        case 'bulk_delete_history':
          return 'red';
        case 'finish':
          return 'blue';
        default:
          return 'gray';
      }
    };

    const color = getDialogColor();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className={`p-6 border-b ${color === 'red' ? 'border-red-200' : color === 'blue' ? 'border-blue-200' : 'border-gray-200'}`}>
            <div className="flex items-center">
              {color === 'red' ? (
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              ) : (
                <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">{confirmAction.title}</h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">{confirmAction.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await confirmAction.action();
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  color === 'red' 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : color === 'blue'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {confirmAction.confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BookingCard = ({ booking, isHistory = false }) => (
    <div className={`bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden ${isHistory ? 'opacity-90' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
              isHistory 
                ? 'bg-gradient-to-br from-gray-500 to-gray-600' 
                : 'bg-gradient-to-br from-green-500 to-emerald-500'
            }`}>
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{booking.car?.model || 'N/A'}</h3>
              <p className="text-sm text-gray-600">{booking.name}</p>
              {!isHistory && booking.car?.carId && (
                <p className="text-xs text-gray-500">Car ID: {booking.car.carId}</p>
              )}
            </div>
            {booking.weddingPurpose && (
              <Heart className="w-5 h-5 text-pink-500 ml-2" title="Wedding Booking" />
            )}
            {booking.withDriver && (
              <UserCheck className="w-5 h-5 text-blue-500 ml-2" title="With Driver" />
            )}
          </div>
          
          <div className="flex gap-2">
            {isHistory ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                <History className="w-4 h-4 mr-1" />
                Finished
              </span>
            ) : (
              <>
                {getBookingStatusBadge(booking.bookingStatus)}
                {getPaymentStatusBadge(booking.paymentStatus, booking.amountPaid, booking.totalAmount)}
              </>
            )}
          </div>
        </div>

        {/* Rest of the card content remains the same */}
        {isHistory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                <User className="w-4 h-4 mr-2" />
                Customer Details
              </h4>
              <p className="text-base font-medium text-gray-900 mb-1">{booking.name}</p>
              {booking.email && (
                <p className="text-sm text-gray-600 mb-1">{booking.email}</p>
              )}
              <p className="text-sm text-gray-600">{booking.phone}</p>
              {booking.altPhone && (
                <p className="text-sm text-gray-600">{booking.altPhone} (Alt)</p>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-700 flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Booking Details
              </h4>
              <div className="space-y-1 text-sm">
                <p><strong>Duration:</strong> {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) + 1} days</p>
                <p><strong>Start:</strong> {new Date(booking.startDate).toLocaleDateString('en-GB')}</p>
                <p><strong>End:</strong> {new Date(booking.endDate).toLocaleDateString('en-GB')}</p>
                <p><strong>Total Amount:</strong> Rs. {booking.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Completed:</strong> {new Date(booking.completedAt).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              </div>
            </div>

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
        )}

        {!isHistory && (
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
        )}

        {booking.notes && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-1">Admin Notes:</p>
            <p className="text-sm text-yellow-700">{booking.notes}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500 flex items-center gap-3">
            <span>Booking ID: {booking._id || booking.bookingId}</span>
            {booking.weddingPurpose && (
              <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                Wedding
              </span>
            )}
          </div>
          {!isHistory ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleFinishBooking(booking._id)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none"
              >
                Finish Booking
              </button>
              <button
                onClick={() => handleDeleteBooking(booking._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none"
              >
                <Trash2 className="w-4 h-4 mr-1 inline" />
                Delete
              </button>
            </div>
          ) : (
            <span className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-semibold rounded-lg opacity-60 cursor-not-allowed">
              <History className="w-4 h-4 mr-1 inline" />
              Archived
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const HistoryTable = () => (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookingHistory.map((booking, index) => (
              <tr key={booking._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                  <div className="text-sm text-gray-500">{booking.phone}</div>
                  {booking.email && <div className="text-xs text-gray-400">{booking.email}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.car?.model || 'N/A'}</div>
                  {booking.car?.carId && <div className="text-sm text-gray-500">ID: {booking.car.carId}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(booking.startDate).toLocaleDateString('en-GB')} - {new Date(booking.endDate).toLocaleDateString('en-GB')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Rs. {booking.totalAmount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    {getPaymentMethodIcon(booking.paymentMethod)}
                    <span className="ml-2 capitalize">{booking.paymentMethod?.replace('_', ' ') || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1">
                    {booking.weddingPurpose && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-700">
                        <Heart className="w-3 h-3 mr-1" />
                        Wedding
                      </span>
                    )}
                    {booking.withDriver && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Driver
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.completedAt ? new Date(booking.completedAt).toLocaleDateString('en-GB') : 'N/A'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <ConfirmDialog />
      
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
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-4 flex-wrap mb-6">
            <div 
              className={`rounded-lg p-3 text-white text-center min-w-[120px] cursor-pointer transition-all duration-300 ${
                !showWeddingOnly && !showWithDriverOnly
                  ? 'bg-gradient-to-br from-green-600 to-green-700 ring-2 ring-green-300' 
                  : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
              onClick={() => {
                setSearch('');
                setShowWeddingOnly(false);
                setShowWithDriverOnly(false);
              }}
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
              onClick={() => setShowWeddingOnly(!showWeddingOnly)}
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
              onClick={() => setShowWithDriverOnly(!showWithDriverOnly)}
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
            <div 
              className="rounded-lg p-3 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-center min-w-[120px] cursor-pointer transition-all duration-300"
              onClick={toggleHistory}
            >
              <p className="text-xs text-gray-100">History</p>
              <p className="text-xl font-bold">{bookingHistory.length}</p>
              <div className="mt-1">
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full flex items-center justify-center">
                  <History className="w-3 h-3 mr-1" />
                  {showHistory ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>
          </div>

          {/* Bulk Delete Operations */}
          <div className="bg-orange-50 rounded-lg p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-700 font-medium">Bulk Operations:</span>
                
                {cancelledBookings.length > 0 && (
                  <button
                    onClick={handleBulkDeleteCancelled}
                    className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Delete All Cancelled ({cancelledBookings.length})
                  </button>
                )}

                {pendingBookings.length > 0 && (
                  <button
                    onClick={handleBulkDeletePending}
                    className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Delete All Pending ({pendingBookings.length})
                  </button>
                )}

                {cancelledBookings.length === 0 && pendingBookings.length === 0 && (
                  <span className="text-sm text-gray-500 italic">
                    No cancelled or pending bookings to delete
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600 flex gap-4">
                <span>Cancelled: {cancelledBookings.length}</span>
                <span>Pending: {pendingBookings.length}</span>
                <span>Confirmed: {confirmedBookings.length}</span>
              </div>
            </div>
          </div>

          {/* Bulk Operations - Only show when viewing history */}
          {showHistory && bookingHistory.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 font-medium">Delete old history records:</span>
                  <select
                    value={bulkDeletePeriod}
                    onChange={(e) => setBulkDeletePeriod(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="">Select period</option>
                    <option value="1month">Older than 1 month</option>
                    <option value="3months">Older than 3 months</option>
                    <option value="6months">Older than 6 months</option>
                    <option value="1year">Older than 1 year</option>
                  </select>
                  
                  {bulkDeletePeriod && (
                    <button
                      onClick={handleBulkDeleteByPeriod}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Delete Old Records
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Total History Records: {bookingHistory.length}
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(search || showWeddingOnly || showWithDriverOnly) && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
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
                  onClick={() => {
                    setSearch('');
                    setShowWeddingOnly(false);
                    setShowWithDriverOnly(false);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Bookings - Only show when history is not shown */}
      {!showHistory && (
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
      )}

      {/* Booking History */}
      {showHistory && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <History className="w-6 h-6 mr-2" />
              Booking History
            </h3>
            <div className="flex items-center gap-3">
              {bookingHistory.length > 0 && (
                <button
                  onClick={downloadHistoryCSV}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download CSV
                </button>
              )}
              
              <button
                onClick={toggleHistory}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-300"
              >
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide History
              </button>
            </div>
          </div>
          
          {historyLoading ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-10 shadow-lg border border-white/20 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-4 animate-spin">
                <History className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-gray-600">Loading booking history...</p>
            </div>
          ) : bookingHistory.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-10 shadow-lg border border-white/20 text-center">
              <History className="w-14 h-14 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No booking history found</h3>
              <p className="text-slate-500 text-base">
                Finished bookings will appear here for your records
              </p>
            </div>
          ) : (
            <>
              <HistoryTable />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminBookings;