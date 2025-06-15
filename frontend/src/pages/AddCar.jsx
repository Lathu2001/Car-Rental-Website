import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/Button";

const AddCar = () => {
  const [car, setCar] = useState({
    carId: "",
    model: "",
    rentPerDay: "",
    fuelCostPerKm: "",
    passengerCount: "",
    imageUrl: "",
  });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/cars/add", car);
      setSuccess(true);

      // Optional: Reset form fields
      setCar({
        carId: "",
        model: "",
        rentPerDay: "",
        fuelCostPerKm: "",
        passengerCount: "",
        imageUrl: "",
      });

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error adding car:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="flex justify-center items-center min-h-full">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-8 transform animate-fade-in">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#0C2E8A] to-indigo-600 bg-clip-text mb-2">
              Add New Vehicle
            </h1>
            <p className="text-gray-600 text-lg">Expand your fleet with a new rental car</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#0C2E8A] to-indigo-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6 shadow-lg transform animate-slide-down">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Success!</p>
                  <p className="text-sm">Car added successfully. Redirecting to dashboard...</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Registration Number */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                  Registration Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="carId"
                    placeholder="e.g., ABC-1234"
                    onChange={handleChange}
                    value={car.carId}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                </div>
              </div>

              {/* Car Model */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                  Car Model
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="model"
                    placeholder="e.g., Toyota Prius"
                    onChange={handleChange}
                    value={car.model}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                </div>
              </div>

              {/* Two Column Layout for Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rent Per Day */}
                <div className="group">
                  <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                    Rent Per Day (LKR)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="rentPerDay"
                      placeholder="e.g., 5000"
                      onChange={handleChange}
                      value={car.rentPerDay}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                  </div>
                </div>

                {/* Fuel Efficiency */}
                <div className="group">
                  <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                    Fuel Efficiency (Km/l)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="fuelCostPerKm"
                      placeholder="e.g., 15"
                      onChange={handleChange}
                      value={car.fuelCostPerKm}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                  Passenger Capacity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="passengerCount"
                    placeholder="e.g., 4"
                    onChange={handleChange}
                    value={car.passengerCount}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                </div>
              </div>

              {/* Image URL */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                  Vehicle Image URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="imageUrl"
                    placeholder="Paste image URL here"
                    onChange={handleChange}
                    value={car.imageUrl}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0C2E8A] to-indigo-600 text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:from-[#0A2570] hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full transition-transform duration-700 hover:translate-x-full"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Adding Vehicle...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">+</span>
                        Add Vehicle to Fleet
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500">
            <p className="text-sm">All fields are required to add a new vehicle</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AddCar;