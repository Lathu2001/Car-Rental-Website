import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditCar = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
  const fetchCar = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cars/${carId}`);
      console.log("Car response:", response.data);
      setCar(response.data.data); // ✅ Fix here
    } catch (err) {
      setError("Car not found or server error.");
    } finally {
      setLoading(false);
    }
  };
  fetchCar();
}, [carId]);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/cars/${carId}`, car);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/admin-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000ms"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000ms"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-700 font-medium animate-pulse">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 relative overflow-hidden flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 animate-bounce">
          <p className="text-red-500 text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 relative overflow-hidden flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <p className="text-gray-700 text-xl font-semibold">No car data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-delayed"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-slow"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-teal-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-700 hover:shadow-3xl animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 animate-gradient">
              Edit Car
            </h1>
            <div className="text-2xl font-semibold text-gray-700 animate-fade-in-delayed">
              {car.model}
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model Field */}
            <div className="transform transition-all duration-300 hover:scale-105">
              <label className="block font-semibold text-gray-700 mb-2 text-lg">
                🚗 Model
              </label>
              <input
                type="text"
                name="model"
                value={car.model}
                onChange={handleChange}
                onFocus={() => setFocusedField("model")}
                onBlur={() => setFocusedField("")}
                className={`w-full px-6 py-4 border-2 rounded-2xl bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg font-medium
                  ${focusedField === "model" 
                    ? "border-blue-500 shadow-lg shadow-blue-200/50 bg-white transform scale-105" 
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                required
              />
            </div>

            {/* Rent Per Day Field */}
            <div className="transform transition-all duration-300 hover:scale-105">
              <label className="block font-semibold text-gray-700 mb-2 text-lg">
                💰 Rent Per Day (LKR)
              </label>
              <input
                type="number"
                name="rentPerDay"
                value={car.rentPerDay}
                onChange={handleChange}
                onFocus={() => setFocusedField("rentPerDay")}
                onBlur={() => setFocusedField("")}
                className={`w-full px-6 py-4 border-2 rounded-2xl bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg font-medium
                  ${focusedField === "rentPerDay" 
                    ? "border-green-500 shadow-lg shadow-green-200/50 bg-white transform scale-105" 
                    : "border-gray-200 hover:border-green-300 hover:shadow-md"
                  }`}
                required
              />
            </div>

            {/* Fuel Efficiency Field */}
            <div className="transform transition-all duration-300 hover:scale-105">
              <label className="block font-semibold text-gray-700 mb-2 text-lg">
                ⛽ Fuel Efficiency (Km/l)
              </label>
              <input
                type="number"
                name="fuelCostPerKm"
                value={car.fuelCostPerKm}
                onChange={handleChange}
                onFocus={() => setFocusedField("fuelCostPerKm")}
                onBlur={() => setFocusedField("")}
                className={`w-full px-6 py-4 border-2 rounded-2xl bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg font-medium
                  ${focusedField === "fuelCostPerKm" 
                    ? "border-orange-500 shadow-lg shadow-orange-200/50 bg-white transform scale-105" 
                    : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                  }`}
                required
              />
            </div>

            {/* Capacity Field */}
            <div className="transform transition-all duration-300 hover:scale-105">
              <label className="block font-semibold text-gray-700 mb-2 text-lg">
                👥 Capacity
              </label>
              <input
                type="number"
                name="passengerCount"
                value={car.passengerCount}
                onChange={handleChange}
                onFocus={() => setFocusedField("passengerCount")}
                onBlur={() => setFocusedField("")}
                className={`w-full px-6 py-4 border-2 rounded-2xl bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg font-medium
                  ${focusedField === "passengerCount" 
                    ? "border-purple-500 shadow-lg shadow-purple-200/50 bg-white transform scale-105" 
                    : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                  }`}
                required
              />
            </div>

            {/* Image URL Field */}
            <div className="transform transition-all duration-300 hover:scale-105">
              <label className="block font-semibold text-gray-700 mb-2 text-lg">
                📸 Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                value={car.imageUrl}
                onChange={handleChange}
                onFocus={() => setFocusedField("imageUrl")}
                onBlur={() => setFocusedField("")}
                className={`w-full px-6 py-4 border-2 rounded-2xl bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg font-medium
                  ${focusedField === "imageUrl" 
                    ? "border-pink-500 shadow-lg shadow-pink-200/50 bg-white transform scale-105" 
                    : "border-gray-200 hover:border-pink-300 hover:shadow-md"
                  }`}
                required
              />
            </div>

            {/* Image Preview */}
            {car.imageUrl && (
              <div className="transform transition-all duration-500 hover:scale-105 animate-fade-in">
                <p className="text-gray-600 mb-3 text-lg font-medium">🖼️ Preview:</p>
                <div className="relative group">
                  <img 
                    src={car.imageUrl} 
                    alt="Car Preview" 
                    className="w-full h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/50 transition-all duration-500 group-hover:shadow-3xl group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="relative pt-6">
              {success && (
                <div className="absolute -top-2 left-0 w-full bg-gradient-to-r from-green-400 to-emerald-400 text-white text-center py-4 px-6 rounded-2xl mb-4 shadow-2xl animate-bounce border-2 border-green-300">
                  <span className="text-2xl mr-2">✅</span>
                  <span className="font-bold text-lg">Car updated successfully!</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold px-8 py-6 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 shadow-xl border-2 border-white/20"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span>💾</span>
                  <span>Save Changes</span>
                  <span>✨</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(2deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(15px) rotate(-2deg); }
          66% { transform: translateY(-10px) rotate(1deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(3deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { transform: translateY(-100px) translateX(50px) rotate(180deg); }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-delayed {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 1s ease-out 0.3s both;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default EditCar;