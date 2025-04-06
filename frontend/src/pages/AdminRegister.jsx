import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        userId: '',
        email: '',
        password: '',
        adminCode: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/register', formData);
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message || 'Registration failed');
        }
    };

    return (
        <div
          className="flex items-center justify-center min-h-screen bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441148345475-03a2e82f9719?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundColor: "#fafafa",
            backgroundBlendMode: "darken",
          }}
        >
          <div className="flex flex-col items-center w-96 p-5 bg-gradient-to-b from-[#000000ee] to-[#666666a] rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center"> Admin Login</h2>
            <form
              className="flex flex-col items-center w-full"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
                required
              />
              
               <input
               type="text"
               name="userId" // Corrected from "username" to "userId"
               placeholder="User ID"
               value={formData.userId} // This correctly binds to formData.userId
               onChange={handleChange}
               className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
               required          
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
                required
              />
    
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="adminCode"
                placeholder="Admin Code"
                value={formData.adminCode}
                onChange={handleChange}
                className="border-2 border-gray-400 rounded-lg m-2 p-2 w-full bg-[#f5f5f5] text-black placeholder:text-slate-500"
                required
              />
              <button
                type="submit"
                className="bg-[#004080] text-white hover:underline font-bold py-2 px-4 rounded-lg w-80 mt-2"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      );
};

export default AdminRegister;