import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";

const Car = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({ userId: "", userName: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Your actual API call - uncomment and use this in your project
    axios
      .get("http://localhost:5000/api/cars")
      .then((res) => {
        setCars(res.data);
        setFilteredCars(res.data);
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

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter(car =>
        (car.model && car.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (car.make && car.make.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCars(filtered);
    }
  }, [searchTerm, cars]);

  const handleBookNow = () => {
    // This will be replaced with Link component
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing cars...</p>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delay"></div>
        <div className="absolute top-1/2 left-3/4 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-reverse"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-50"></div>
      </div>

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Header with Search */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Available Now</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-8"></div>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by car model or make..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search Results Count */}
            {searchTerm.trim() !== "" && (
              <p className="text-sm text-gray-600 mt-2">
                Found {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car, index) => (
            <div
              key={car._id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              {/* Car Image */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={car.imageUrl || '/default-car.jpg'}
                  alt={car.model}
                  className={`w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 `}
                />
                
             

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Car Details - Always Visible */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                  {car.make} {car.model}
                </h3>
                
                {/* Car Specifications */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 text-lg">💰</span>
                      <span className="font-medium text-gray-700 text-sm">Daily Rate</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">Rs. {car.rentPerDay.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 text-lg">⛽</span>
                      <span className="font-medium text-gray-700 text-sm">Fuel Economy</span>
                    </div>
                    <span className="font-semibold text-blue-600">{car.fuelCostPerKm} Km/l</span>
                  </div>

                  <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-600 text-lg">👥</span>
                      <span className="font-medium text-gray-700 text-sm">Capacity</span>
                    </div>
                    <span className="font-semibold text-purple-600">{car.passengerCount} Passengers</span>
                  </div>
                </div>

                {/* Action Button */}
             
                  <Link to={`/book-car/${car.carId}`} className="block">
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group">
                      <span className="flex items-center justify-center space-x-2">
                        <span>Book Now</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </button>
                  </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCars.length === 0 && searchTerm.trim() !== "" && cars.length > 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-bounce">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Cars Found</h3>
            <p className="text-gray-600 mb-4">No cars match your search for "{searchTerm}"</p>
            <button
              onClick={clearSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* No Cars Available from API */}
        {cars.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-bounce">🚗</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Cars Available</h3>
            <p className="text-gray-600">Check back later for new arrivals!</p>
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white py-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">Ready to Hit the Road?</h2>
          <p className="text-xl opacity-90 mb-8 animate-fade-in animation-delay-500">
            Join thousands of satisfied customers who trust us with their journey
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2 animate-fade-in animation-delay-1000">
              <span className="text-green-400">✓</span>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2 animate-fade-in animation-delay-1200">
              <span className="text-green-400">✓</span>
              <span>Instant Booking</span>
            </div>
            <div className="flex items-center space-x-2 animate-fade-in animation-delay-1400">
              <span className="text-green-400">✓</span>
              <span>Best Prices</span>
            </div>
            <div className="flex items-center space-x-2 animate-fade-in animation-delay-1600">
              <span className="text-green-400">✓</span>
              <span>Premium Fleet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes float-delay {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        
        @keyframes float-reverse {
          0%, 100% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(10px);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
        
        .animation-delay-1400 {
          animation-delay: 1.4s;
        }
        
        .animation-delay-1600 {
          animation-delay: 1.6s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Car;