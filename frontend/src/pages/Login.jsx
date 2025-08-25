import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

export default function Login() {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "", show: false });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear field-specific error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.identifier) {
            newErrors.identifier = "Email is required";
        } else if (!formData.identifier.includes('@')) {
            newErrors.identifier = "Please enter a valid email address";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showNotification = (message, type = "error") => {
        setNotification({ message, type, show: true });
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            setNotification({ message: "", type: "", show: false });
        }, 5000);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        
        // Validate form before submitting
        if (!validateForm()) {
            showNotification("Please fix the errors below", "error");
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json',
                }
            });
                     
            const { token, user } = response.data;
            
            if (!token || !user) {
                throw new Error("Invalid response from server");
            }
                      
            // Store user data securely (consider using sessionStorage for better security)
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("userId", user.id);
            sessionStorage.setItem("username", user.name || user.username || "User");
            sessionStorage.setItem("userEmail", user.email);
                 
            showNotification("Welcome! Login successful. Redirecting...", "success");
            
            // Redirect after showing success message
            setTimeout(() => {
                navigate('/user-dashboard');
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = "Login failed. Please try again.";
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timeout. Please check your internet connection.";
            } else if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const serverMessage = error.response.data?.message;
                
                switch (status) {
                    case 400:
                        errorMessage = serverMessage || "Invalid email or password";
                        break;
                    case 401:
                        errorMessage = "Invalid credentials. Please check your email and password.";
                        break;
                    case 404:
                        errorMessage = "Account not found. Please check your email or register.";
                        break;
                    case 429:
                        errorMessage = "Too many login attempts. Please try again later.";
                        break;
                    case 500:
                        errorMessage = "Server error. Please try again later.";
                        break;
                    default:
                        errorMessage = serverMessage || `Error ${status}: Please try again.`;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "Unable to connect to server. Please check your internet connection.";
            }
            
            showNotification(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const closeNotification = () => {
        setNotification({ message: "", type: "", show: false });
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

            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between max-w-md transform transition-all duration-300 ${
                    notification.type === 'success' 
                        ? 'bg-green-50 border-green-500 text-green-700' 
                        : 'bg-red-50 border-red-500 text-red-700'
                }`}>
                    <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                            {notification.type === 'success' ? (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <span className="text-sm font-medium">{notification.message}</span>
                    </div>
                    <button 
                        onClick={closeNotification}
                        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}

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
                            type="email"
                            value={formData.identifier}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField("identifier")}
                            onBlur={() => setFocusedField("")}
                            placeholder="Email"
                            aria-label="Email address"
                            aria-invalid={errors.identifier ? 'true' : 'false'}
                            aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                            required
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm
                                ${errors.identifier 
                                    ? "border-red-500 shadow-lg shadow-red-500/20" 
                                    : focusedField === "identifier" 
                                        ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-white" 
                                        : "border-gray-200 hover:border-gray-300"
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                        <div className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full ${
                            focusedField === "identifier" ? "w-full" : "w-0"
                        }`}></div>
                        {errors.identifier && (
                            <p id="identifier-error" className="text-red-500 text-xs mt-1 ml-2">{errors.identifier}</p>
                        )}
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
                            aria-label="Password"
                            aria-invalid={errors.password ? 'true' : 'false'}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                            required
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm
                                ${errors.password 
                                    ? "border-red-500 shadow-lg shadow-red-500/20" 
                                    : focusedField === "password" 
                                        ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-white" 
                                        : "border-gray-200 hover:border-gray-300"
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                        <div className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full ${
                            focusedField === "password" ? "w-full" : "w-0"
                        }`}></div>
                        {errors.password && (
                            <p id="password-error" className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        aria-describedby="login-button-description"
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