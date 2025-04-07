import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cars");
        setCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Delete car function
  const deleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/cars/${carId}`);
      setCars(cars.filter((car) => car.carId !== carId)); // Remove from state
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  if (loading) return <p>Loading cars...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <Button onClick={() => navigate("/add-car")} className="mb-4 bg-green-500 text-white text-lg">
        Add New Car
      </Button>

      {cars.length === 0 ? (
        <p>No cars found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cars.map((car) => (
            <div key={car.carId} className="border p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <img src={car.imageUrl} alt={car.model} className="w-full h-48 object-cover rounded-lg mb-4" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{car.model}</h2>
                <p className="text-gray-600"><strong>Cost:</strong> {car.rentPerDay} LKR</p>
                <p className="text-gray-600"><strong>Fuel Consumption:</strong> {car.fuelCostPerKm} Km/l</p>
                <p className="text-gray-600"><strong>Passengers:</strong> {car.passengerCount}</p>

                <div className="mt-4 flex gap-4">
                  <Button onClick={() => navigate(`/edit-car/${car.carId}`)} className="bg-blue-500 text-white">
                    Edit
                  </Button>
                  <Button onClick={() => deleteCar(car.carId)} className="bg-red-500 text-white">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
