import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/Button";
import API_BASE_URL from '../config/api';

const EditCar = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cars/${carId}`);
        setCar(response.data.data);
      } catch {
        alert("Car not found or server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.put(`${API_BASE_URL}/api/cars/${carId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.data.imageUrl) {
        setCar((prev) => ({ ...prev, imageUrl: response.data.data.imageUrl }));
      }
    } catch {
      alert("Image upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/cars/${carId}`, car);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/admin-dashboard");
      }, 2000);
    } catch {
      alert("Failed to update car. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0C2E8A]/30 border-t-[#0C2E8A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Car not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="flex justify-center items-center min-h-full">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-8 transform animate-fade-in">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#0C2E8A] to-indigo-600 bg-clip-text mb-2">
              Edit Vehicle
            </h1>
            <p className="text-gray-600 text-lg">Update your rental car details</p>
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
                  <p className="text-sm">Car updated successfully. Redirecting to dashboard...</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={car.model}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                </div>
              </div>

              {/* Three Column Layout for Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                    Daily Rent (LKR)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="rentPerDay"
                      placeholder="e.g., 5000"
                      value={car.rentPerDay}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                    Long-term Rate (LKR)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="longPeriodRentPerDay"
                      placeholder="e.g., 4000"
                      value={car.longPeriodRentPerDay}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                    Wedding Extra (LKR)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="weddingPurposeExtra"
                      placeholder="e.g., 2000"
                      value={car.weddingPurposeExtra}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout for Technical Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                    Fuel Efficiency (Km/l)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="fuelCostPerKm"
                      placeholder="e.g., 15"
                      value={car.fuelCostPerKm}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                    Passenger Capacity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="passengerCount"
                      placeholder="e.g., 4"
                      value={car.passengerCount}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Vehicle Image Upload */}
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-700 transition-colors group-hover:text-[#0C2E8A]">
                  Vehicle Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-[#0C2E8A] focus:bg-white focus:shadow-lg hover:border-gray-300 hover:shadow-md group-hover:border-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0C2E8A] file:text-white hover:file:bg-indigo-700"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0C2E8A]/5 to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
                </div>
                
                {/* Upload Status */}
                {isUploading && (
                  <div className="flex items-center mt-3 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                    <p className="text-sm font-medium">Uploading image...</p>
                  </div>
                )}
                
                {/* Image Preview */}
                {car.imageUrl && !isUploading && (
                  <div className="mt-4 relative overflow-hidden rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <img 
                      src={car.imageUrl} 
                      alt="Car Preview" 
                      className="w-full h-72 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0C2E8A] to-indigo-600 text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:from-[#0A2570] hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full transition-transform duration-700 hover:translate-x-full"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-2">💾</span>
                    Save Changes
                  </span>
                </Button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500">
            <p className="text-sm">Update vehicle information to keep your fleet current</p>
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

export default EditCar;