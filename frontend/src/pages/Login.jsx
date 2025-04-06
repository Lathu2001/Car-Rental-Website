import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", formData);
            alert("Welcome to the Vehicle Rental System!");
            localStorage.setItem("token", response.data.token);
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed. Please check your email or password.');
        }
    };

    return (
        <div
            className="flex items-center justify-center h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://www.shutterstock.com/image-photo/red-car-driving-panoramic-road-600nw-2461512533.jpg')" }}
        >
            <div className="bg-white rounded shadow-lg p-6 w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <input
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="border-2 w-full p-2 rounded"
                        />
                    </div>
                    <div>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            type="password"
                            placeholder="Password"
                            className="border-2 w-full p-2 rounded"
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
                   <p>Don’t have an account? <a href="/register" className="text-blue-500 underline">Register</a></p> 
                   <p> Login as Admin <a href="/AdminLogin" className="text-blue-500 underline">Login</a></p>
                </div>
            </div>
        </div>
    );
}