import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    city: "",
    address: "",
    phoneNumber: "",
    nicNumber: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateField = (name, value) => {
    let error = "";

    // Email validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email address.";
      }
    }

    // Phone number validation
    if (name === "phoneNumber") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        error = "Phone number must be 10 digits.";
      }
    }

    // NIC number validation
    if (name === "nicNumber") {
      const nicRegex = /^(?:[0-9]{12}|[0-9]{9}[Vv])$/;
      if (!nicRegex.test(value)) {
        error = "NIC number must be 12 digits or 10 digits followed by 'V' or 'v'.";
      }
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    // Final validation before submission
    const errors = Object.keys(formData).reduce((acc, field) => {
      validateField(field, formData[field]);
      if (formErrors[field]) acc[field] = formErrors[field];
      return acc;
    }, {});

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(response.data.message);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Registration failed. Please try again.");
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/car-led-lights-realistic-composition-with-dark-silhouette-automobile-with-dimmed-headlights-shadows-illustration_1284-28532.jpg?ga=GA1.1.1088011668.1713541224&semt=ais_hybrid.jpg')",
        backgroundColor: "#fafafa",
        backgroundBlendMode: "darken",
      }}
    >
      <div className="flex flex-col items-center w-96 p-5 bg-gradient-to-b from-[#000000ee] to-[#666666a] rounded-2xl shadow-lg">
        <form className="flex flex-col items-center w-full" onSubmit={handleRegistration}>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
            type="text"
            placeholder="Name"
          />
          {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}

          <input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
            type="text"
            placeholder="Username"
          />
          {formErrors.username && <p className="text-red-500 text-sm">{formErrors.username}</p>}

          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
            type="text"
            placeholder="Email"
          />
          {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

          <input
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
            type="text"
            placeholder="City"
          />
          {formErrors.city && <p className="text-red-500 text-sm">{formErrors.city}</p>}

          <input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
            type="text"
            placeholder="Address"
          />
          {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}

          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
            type="text"
            placeholder="Phone Number"
          />
          {formErrors.phoneNumber && <p className="text-red-500 text-sm">{formErrors.phoneNumber}</p>}

          <input
            name="nicNumber"
            value={formData.nicNumber}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
            type="text"
            placeholder="NIC Number"
          />
          {formErrors.nicNumber && <p className="text-red-500 text-sm">{formErrors.nicNumber}</p>}

          <input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
            type="password"
            placeholder="Password"
          />
          {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}

          <button
            type="submit"
            className="bg-[#004080] text-white hover:underline font-bold py-2 px-4 rounded-lg w-80 mt-2"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-sm text-center text-gray-600">
          Register as Admin  <a href="/admin-register" className="text-blue-500 underline">Register</a>
        </div>
      </div>
    </div>
  );
}