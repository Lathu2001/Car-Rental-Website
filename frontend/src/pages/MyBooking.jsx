import React, { useEffect, useState } from 'react';
import { Calendar, Car, User, CreditCard, Clock, MapPin } from 'lucide-react';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        // Step 1: Get user data from token
        const userResponse = await fetch('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userResponse.json();

        const email = userData.email;
        setUserEmail(email);

        // Step 2: Use email to get bookings
        const bookingResponse = await fetch(`http://localhost:5000/api/bookings/email/${email}`);
        const bookingData = await bookingResponse.json();
        setBookings(bookingData);
      } catch (error) {
        console.error('Error fetching user or bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white backdrop-blur-lg rounded-full mb-6 animate-spin shadow-lg border">
            <Car className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading your bookings...</h2>
          <p className="text-gray-700">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-300/40 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white backdrop-blur-lg rounded-full mb-6 shadow-lg border">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-700 text-lg">Your rental history and upcoming trips</p>
          {userEmail && (
            <div className="mt-4 inline-flex items-center bg-white backdrop-blur-lg rounded-full px-6 py-2 shadow-lg border">
              <User className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-gray-800 text-sm font-medium">{userEmail}</span>
            </div>
          )}
        </div>

        {/* Bookings Content */}
        {bookings.length === 0 ? (
          <div className="text-center">
            <div className="bg-white backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto border shadow-lg">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Bookings Yet</h3>
              <p className="text-gray-700 leading-relaxed">
                You haven't made any bookings yet. Start exploring our fleet and book your first ride!
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {bookings.map((booking, index) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Car Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-6">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {booking.car?.model}
                      </h3>
                      <p className="text-gray-600 text-sm">Car ID: {booking.car?.carId}</p>
                    </div>
                  </div>
                  
                  {/* Total Amount - Prominent Display */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">
                      Rs. {booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Booking Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Start Date */}
                  <div className="flex items-center bg-blue-50 rounded-xl p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Start Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* End Date */}
                  <div className="flex items-center bg-purple-50 rounded-xl p-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">End Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Driver Status */}
                  <div className="flex items-center bg-green-50 rounded-xl p-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Driver</p>
                      <div className="mt-1">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          booking.withDriver 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-orange-200 text-orange-800'
                        }`}>
                          {booking.withDriver ? "Included" : "Self Drive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Background Animation */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent"></div>
    </div>
  );
}

export default MyBookings;