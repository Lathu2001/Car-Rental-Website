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

  const clearSearch = () => {
    setSearchTerm("");
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCars.map((car, index) => (
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
                <Link to={`/book-car/${car.carId}`} className="block">
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    BOOK NOW
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