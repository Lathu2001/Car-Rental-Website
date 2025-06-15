import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState("");

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", formData);
                     
            const { token, user } = response.data;
                      
            // Store user ID in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("userId", user.id);
            localStorage.setItem("username", user.name);
            localStorage.setItem("userEmail", user.email);
                 
            alert("Welcome to the Vehicle Rental System!");
            navigate('/user-dashboard');
        } catch (error) {
            alert('Login failed. Please check your email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center relative overflow-hidden"
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
            }}
        >
            {/* Animated overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/50 to-black/80"></div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-300/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-300/15 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative z-10 transform transition-all duration-500 hover:scale-105 border border-white/20">
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-sm animate-pulse"></div>
                
                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600">Sign in to your vehicle rental account</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6 relative z-10">
                    <div className="relative">
                        <input
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField("identifier")}
                            onBlur={() => setFocusedField("")}
                            placeholder="Email"
                            required
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm
                                ${focusedField === "identifier" 
                                    ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-white" 
                                    : "border-gray-200 hover:border-gray-300"
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                        <div className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full ${
                            focusedField === "identifier" ? "w-full" : "w-0"
                        }`}></div>
                    </div>

                    <div className="relative">
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField("")}
                            placeholder="Password"
                            required
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm
                                ${focusedField === "password" 
                                    ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-white" 
                                    : "border-gray-200 hover:border-gray-300"
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                        <div className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full ${
                            focusedField === "password" ? "w-full" : "w-0"
                        }`}></div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 
                            ${isLoading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                            }
                            focus:outline-none focus:ring-4 focus:ring-blue-500/30`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Signing In...</span>
                            </div>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <div className="mt-8 space-y-3 text-sm text-center text-gray-600 relative z-10">
                    <p>
                        Don't have an account? 
                        <a href="/register" className="text-blue-600 hover:text-purple-600 underline decoration-2 underline-offset-4 transition-colors duration-300 ml-1 font-medium">
                            Register
                        </a>
                    </p>
                    <p>
                        Login as Admin 
                        <a href="/admin-login" className="text-blue-600 hover:text-purple-600 underline decoration-2 underline-offset-4 transition-colors duration-300 ml-1 font-medium">
                            Admin Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}