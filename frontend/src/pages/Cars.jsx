import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Car = () => {
  const [cars, setCars] = useState([]);
  const [user, setUser] = useState({ userId: "", userName: "" });
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cars")
      .then((res) => setCars(res.data))
      .catch((err) => console.error("Error fetching cars:", err));

    // ✅ Load user from localStorage
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("username");

    if (userId && userName) {
      setUser({ userId, userName });
    }
  }, []);


  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Available Cars</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cars.map((car) => (
          <div key={car._id} className="relative border rounded-lg p-4 shadow-md bg-white">
            <img
              src={car.imageUrl}
              alt={car.model}
              className={`w-full h-48 object-cover rounded-lg ${car.isBooked ? "opacity-50" : ""}`}
            />
            <h3 className="text-xl font-semibold mt-2">{car.model}</h3>
            <p><strong>Rent Per Day:</strong> lkr {car.rentPerDay}</p>
            <p><strong>Fuel Cost Per Km:</strong> {car.fuelCostPerKm} Km/l</p>
            <p><strong>Passenger Capacity:</strong> {car.passengerCount}</p>

            {!car.isBooked && (
              <Link to={`/login`}>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700">
                  Book Now
                </button>
              </Link>
            )}

            {car.isBooked && (
              <p className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm">Booked</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Car;
