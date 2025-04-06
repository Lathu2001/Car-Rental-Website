import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/login', formData);
            alert('Login successful');
            // Store token in localStorage or context
            localStorage.setItem('adminToken', response.data.token);
            navigate('/admin-dashboard'); // Redirect to admin dashboard
        } catch (error) {
            alert(error.response.data.message || 'Login failed');
        }
    };

    return (
        <div
            className="flex items-center justify-center h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/07/99/64/49/240_F_799644929_O9YyLUAjwbrr91RKLorIEc7AqkneeNyz.jpg ')" }}
        >
            <div className="bg-white rounded shadow-lg p-6 w-96">
                <h2 className="text-2xl font-bold mb-4 text-center"> Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border-2 w-full p-2 rounded"
                        required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border-2 w-full p-2 rounded"
                            required                      
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white w-full py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-sm text-center text-gray-600">
                    Don’t have an Admin account? <a href="/register" className="text-blue-500 underline">Register</a>
                </div>
            </div>
        </div>
    );
    
};

export default AdminLogin;


