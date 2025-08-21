import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Car = () => {
  const [cars, setCars] = useState([]);
  const [user, setUser] = useState({ userId: "", userName: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Your actual API call - uncomment and use this in your project
    axios
      .get("http://localhost:5000/api/cars")
      .then((res) => {
        setCars(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setLoading(false);
      });

    // Load user from localStorage
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("username");
    if (userId && userName) {
      setUser({ userId, userName });
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Available Now</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car, index) => (
            <div
              key={car._id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Car Image with Price Overlay */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={car.image || car.imageUrl || '/api/placeholder/400/250'}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/250';
                  }}
                />
                
                {/* Price Overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white rounded-lg px-3 py-2 shadow-lg">
                    <div className="text-lg font-bold text-gray-800">
                      LKR {car.rentPerDay.toLocaleString()}/Day
                    </div>
                  </div>
                </div>
              </div>

              {/* Car Details */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {car.make} {car.model}
                </h3>
                
                {/* Book Now Button */}
                <Link to={`/login`} className="block">
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    BOOK NOW
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Cars Available</h3>
            <p className="text-gray-600">Check back later for new arrivals!</p>
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of satisfied customers who trust us with their journey
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Instant Booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Best Prices</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Premium Fleet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Car;