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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#0C2E8A]">Add New Car</h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            ✅ Car added successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-semibold">Registration Number</label>
            <input
              type="text"
              name="carId"
              placeholder="e.g., ABC-1234"
              onChange={handleChange}
              value={car.carId}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Car Model</label>
            <input
              type="text"
              name="model"
              placeholder="e.g., Toyota Prius"
              onChange={handleChange}
              value={car.model}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Rent Per Day (LKR)</label>
            <input
              type="number"
              name="rentPerDay"
              placeholder="e.g., 5000"
              onChange={handleChange}
              value={car.rentPerDay}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Fuel Efficiency (Km/l)</label>
            <input
              type="number"
              name="fuelCostPerKm"
              placeholder="e.g., 15"
              onChange={handleChange}
              value={car.fuelCostPerKm}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Capacity</label>
            <input
              type="number"
              name="passengerCount"
              placeholder="e.g., 4"
              onChange={handleChange}
              value={car.passengerCount}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              placeholder="Paste image URL here"
              onChange={handleChange}
              value={car.imageUrl}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <Button
            type="submit"
            className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg py-2 px-4 rounded-lg hover:shadow-lg transition duration-300"
          >
            Add Car
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
