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

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/${carId}`);
        setCar(response.data);
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

  if (loading) return <p>Loading car details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!car) return <p>No car data found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Car - {car.model}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Model</label>
          <input
            type="text"
            name="model"
            value={car.model}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Rent Per Day (LKR)</label>
          <input
            type="number"
            name="rentPerDay"
            value={car.rentPerDay}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Fuel Efficiency (Km/l)</label>
          <input
            type="number"
            name="fuelCostPerKm"
            value={car.fuelCostPerKm}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Capacity</label>
          <input
            type="number"
            name="passengerCount"
            value={car.passengerCount}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={car.imageUrl}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>

        {car.imageUrl && (
          <div className="mt-2">
            <p className="text-gray-600 mb-1">Preview:</p>
            <img src={car.imageUrl} alt="Car Preview" className="w-full h-56 object-cover rounded shadow" />
          </div>
        )}

        <div className="relative">
          {/* Success message placed right above button */}
          {success && (
            <div className="absolute -top-12 left-0 w-full bg-green-100 border border-green-400 text-green-700 text-center py-2 px-4 rounded mb-2 shadow">
              ✅ Car updated successfully!
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded w-full"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCar;
