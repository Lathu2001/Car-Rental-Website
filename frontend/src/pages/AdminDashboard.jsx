// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button } from "../components/ui/Button";
// import { FiPlusCircle, FiEdit3, FiTrash2, FiSearch, FiX } from "react-icons/fi";
// import { FaCar, FaUsers, FaGasPump, FaDollarSign } from "react-icons/fa";
// import API_BASE_URL from '../config/api';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [cars, setCars] = useState([]);
//   const [filteredCars, setFilteredCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [imageErrors, setImageErrors] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/cars`);
//         setCars(response.data);
//         setFilteredCars(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching cars:", error);
//         setLoading(false);
//       }
//     };
//     fetchCars();
//   }, []);

//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredCars(cars);
//     } else {
//       const filtered = cars.filter((car) =>
//         car.model?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredCars(filtered);
//     }
//   }, [searchTerm, cars]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const clearSearch = () => setSearchTerm("");

//   const handleImageError = (carId) => {
//     setImageErrors(prev => ({ ...prev, [carId]: true }));
//   };

//   const handleImageLoad = (carId) => {
//     setImageErrors(prev => ({ ...prev, [carId]: false }));
//   };

//   const deleteCar = async (carId) => {
//     if (!window.confirm("Are you sure you want to delete this car?")) return;
//     try {
//       await axios.delete(`${API_BASE_URL}/api/cars/${carId}`);
//       setCars(cars.filter((car) => car.carId !== carId));
//     } catch (error) {
//       console.error("Error deleting car:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
//             <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
//           </div>
//           <p className="text-blue-700 text-lg font-medium animate-pulse">Loading cars...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
//       {/* Header */}
//       <div className="bg-white shadow-lg border-b border-blue-100">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//             <div className="text-center md:text-left">
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
//                 Admin Dashboard
//               </h1>
//               <p className="text-blue-600 mt-2 opacity-0 animate-fade-in-delay">
//                 Manage your car rental fleet
//               </p>
//             </div>
            
//             <Button
//               onClick={() => navigate("/add-car")}
//               className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-in-right"
//             >
//               <div className="flex items-center gap-3">
//                 <FaCar size={20} className="group-hover:rotate-12 transition-transform duration-300" />
//                 <FiPlusCircle size={22} className="group-hover:rotate-90 transition-transform duration-300" />
//                 <span className="font-semibold">Add New Car</span>
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             </Button>
//           </div>

//           {/* Search */}
//           <div className="mt-8 max-w-md mx-auto md:mx-0">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <FiSearch className="h-5 w-5 text-blue-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by car model..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 className="w-full pl-12 pr-12 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 placeholder-blue-400"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={clearSearch}
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors duration-200"
//                 >
//                   <FiX className="h-5 w-5" />
//                 </button>
//               )}
//             </div>
//             {searchTerm && (
//               <p className="mt-2 text-sm text-blue-600">
//                 {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Cars Grid */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {filteredCars.length === 0 ? (
//           <div className="text-center py-16 animate-fade-in">
//             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FaCar size={40} className="text-blue-500" />
//             </div>
//             <h3 className="text-2xl font-semibold text-blue-700 mb-2">
//               {searchTerm ? "No Cars Found" : "No Cars Available"}
//             </h3>
//             <p className="text-blue-600">
//               {searchTerm 
//                 ? `No cars found matching "${searchTerm}"`
//                 : "Start by adding your first car to the fleet"
//               }
//             </p>
//             {searchTerm && (
//               <button
//                 onClick={clearSearch}
//                 className="mt-4 text-blue-500 hover:text-blue-700 underline transition-colors duration-200"
//               >
//                 Clear search to see all cars
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {filteredCars.map((car, index) => (
//               <div
//                 key={car.carId}
//                 className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 {/* Image */}
//                 <div className="relative overflow-hidden">
//                   {imageErrors[car.carId] ? (
//                     <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col items-center justify-center">
//                       <FaCar size={60} className="text-blue-400 mb-3" />
//                       <p className="text-blue-600 text-sm font-medium">{car.model}</p>
//                       <p className="text-blue-500 text-xs">Image not available</p>
//                     </div>
//                   ) : (
//                     <>
//                       <img
//                         src={car.imageUrl}
//                         alt={car.model}
//                         className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
//                         onError={() => handleImageError(car.carId)}
//                         onLoad={() => handleImageLoad(car.carId)}
//                         loading="lazy"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     </>
//                   )}
                  
//                   {/* Floating Buttons */}
//                   <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
//                     <button
//                       onClick={() => navigate(`/edit-car/${car.carId}`)}
//                       className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
//                     >
//                       <FiEdit3 size={16} />
//                     </button>
//                     <button
//                       onClick={() => deleteCar(car.carId)}
//                       className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
//                     >
//                       <FiTrash2 size={16} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Card Content */}
//                 <div className="p-6">
//                   <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
//                     {car.model}
//                   </h2>
                  
//                   {car.registrationNumber && (
//                     <div className="mb-4 p-2 bg-blue-50 rounded-lg">
//                       <p className="text-sm font-medium text-blue-700">
//                         Reg: {car.registrationNumber}
//                       </p>
//                     </div>
//                   )}

//                   {/* Info List */}
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                           <FaDollarSign size={14} className="text-white" />
//                         </div>
//                         <span className="text-sm font-medium text-gray-600">Daily Rate</span>
//                       </div>
//                       <span className="font-bold text-blue-700">{car.rentPerDay} LKR</span>
//                     </div>

//                     <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                           <FaDollarSign size={14} className="text-white" />
//                         </div>
//                         <span className="text-sm font-medium text-gray-600">Long-term Rent/Day</span>
//                       </div>
//                       <span className="font-bold text-blue-700">{car.longPeriodRentPerDay} LKR</span>
//                     </div>

//                     <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                           <FaDollarSign size={14} className="text-white" />
//                         </div>
//                         <span className="text-sm font-medium text-gray-600">Wedding Extra</span>
//                       </div>
//                       <span className="font-bold text-blue-700">{car.weddingPurposeExtra} LKR</span>
//                     </div>

//                     <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
//                           <FaGasPump size={14} className="text-white" />
//                         </div>
//                         <span className="text-sm font-medium text-gray-600">Fuel Economy</span>
//                       </div>
//                       <span className="font-bold text-indigo-700">{car.fuelCostPerKm} Km/l</span>
//                     </div>

//                     <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors duration-200">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
//                           <FaUsers size={14} className="text-white" />
//                         </div>
//                         <span className="text-sm font-medium text-gray-600">Passengers</span>
//                       </div>
//                       <span className="font-bold text-sky-700">{car.passengerCount}</span>
//                     </div>
//                   </div>

//                   <div className="mt-6 flex gap-3">
//                     <Button
//                       onClick={() => navigate(`/edit-car/${car.carId}`)}
//                       className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
//                     >
//                       <FiEdit3 size={16} />
//                       Edit
//                     </Button>
//                     <Button
//                       onClick={() => deleteCar(car.carId)}
//                       className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
//                     >
//                       <FiTrash2 size={16} />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fade-in-delay {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes slide-in-right {
//           from { opacity: 0; transform: translateX(30px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
//         .animate-fade-in-delay { animation: fade-in-delay 0.8s ease-out 0.3s forwards; }
//         .animate-slide-in-right { animation: slide-in-right 0.6s ease-out forwards; }
//         .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; opacity: 0; }
//       `}</style>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { FiPlusCircle, FiEdit3, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import { FaCar, FaUsers, FaGasPump, FaDollarSign } from "react-icons/fa";
import API_BASE_URL from '../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cars`);
        setCars(response.data);
        setFilteredCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter((car) =>
        car.model?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  }, [searchTerm, cars]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => setSearchTerm("");

  const handleImageError = (carId) => {
    setImageErrors(prev => ({ ...prev, [carId]: true }));
  };

  const handleImageLoad = (carId) => {
    setImageErrors(prev => ({ ...prev, [carId]: false }));
  };

  const deleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/cars/${carId}`);
      setCars(cars.filter((car) => car.carId !== carId));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-blue-700 text-lg font-medium animate-pulse">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Centered Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
              Admin Dashboard
            </h1>
            <p className="text-blue-600 mt-2 animate-fade-in-delay">
              Manage your car rental fleet
            </p>
          </div>

          {/* Search and Add Car Button Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-2/3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by car model..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-12 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 placeholder-blue-400"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="mt-2 text-sm text-blue-600 text-center md:text-left">
                  {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>
            <div className="w-full md:w-auto flex flex-col items-end">
              {/* Total Cars Indicator */}
              <div className="mb-2 bg-blue-50 rounded-lg px-4 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <FaCar size={16} className="text-blue-600" />
                  <span className="text-blue-700 font-semibold text-sm">Total Cars: {cars.length}</span>
                </div>
              </div>
              
              <Button
                onClick={() => navigate("/add-car")}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-in-right"
              >
                <div className="flex items-center gap-3">
                  <FaCar size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                  <FiPlusCircle size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-semibold">Add New Car</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredCars.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCar size={40} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">
              {searchTerm ? "No Cars Found" : "No Cars Available"}
            </h3>
            <p className="text-blue-600">
              {searchTerm 
                ? `No cars found matching "${searchTerm}"`
                : "Start by adding your first car to the fleet"
              }
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 text-blue-500 hover:text-blue-700 underline transition-colors duration-200"
              >
                Clear search to see all cars
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCars.map((car, index) => (
              <div
                key={car.carId}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  {imageErrors[car.carId] ? (
                    <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col items-center justify-center">
                      <FaCar size={60} className="text-blue-400 mb-3" />
                      <p className="text-blue-600 text-sm font-medium">{car.model}</p>
                      <p className="text-blue-500 text-xs">Image not available</p>
                    </div>
                  ) : (
                    <>
                      <img
                        src={car.imageUrl}
                        alt={car.model}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => handleImageError(car.carId)}
                        onLoad={() => handleImageLoad(car.carId)}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                  
                  {/* Floating Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => navigate(`/edit-car/${car.carId}`)}
                      className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                    >
                      <FiEdit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteCar(car.carId)}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                    {car.model}
                  </h2>
                  
                  {car.registrationNumber && (
                    <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-700">
                        Reg: {car.registrationNumber}
                      </p>
                    </div>
                  )}

                  {/* Info List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaDollarSign size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Daily Rate</span>
                      </div>
                      <span className="font-bold text-blue-700">{car.rentPerDay} LKR</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaDollarSign size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Long-term Rent/Day</span>
                      </div>
                      <span className="font-bold text-blue-700">{car.longPeriodRentPerDay} LKR</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaDollarSign size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Wedding Extra</span>
                      </div>
                      <span className="font-bold text-blue-700">{car.weddingPurposeExtra} LKR</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                          <FaGasPump size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Fuel Economy</span>
                      </div>
                      <span className="font-bold text-indigo-700">{car.fuelCostPerKm} Km/l</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                          <FaUsers size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Passengers</span>
                      </div>
                      <span className="font-bold text-sky-700">{car.passengerCount}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={() => navigate(`/edit-car/${car.carId}`)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiEdit3 size={16} />
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteCar(car.carId)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-delay { animation: fade-in-delay 0.8s ease-out 0.3s forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;