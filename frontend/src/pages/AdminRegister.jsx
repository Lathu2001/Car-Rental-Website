import React, { useState } from 'react';
import { User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        userId: '',
        email: '',
        password: '',
        adminCode: '',
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    
    const navigate = {
        push: (path) => console.log(`Navigating to: ${path}`)
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Simulate API call
            const response = await fetch('http://localhost:5000/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            alert(data.message || 'Registration successful!');
        } catch (error) {
            alert('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* Car Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
                }}
            ></div>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/20 to-cyan-900/40"></div>
            
            {/* Animated Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
            </div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Registration Panel - Centered */}
            <div className="relative z-10 w-full max-w-md">
                <div className="relative">
                    {/* Glassmorphism Card */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                        {/* Animated Border */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 p-[2px] opacity-50">
                            <div className="bg-black/80 rounded-3xl h-full w-full"></div>
                        </div>
                        
                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl mb-6 animate-bounce shadow-lg">
                                    <Shield size={40} className="text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                    Admin Registration
                                </h1>
                                <p className="text-gray-200 text-lg">Join the elite admin community</p>
                            </div>

                            <div className="space-y-6">
                                {/* Name Field */}
                                <div className="relative group">
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'name' ? 'opacity-30' : ''}`}></div>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 z-10" size={20} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField('')}
                                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* User ID Field */}
                                <div className="relative group">
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'userId' ? 'opacity-30' : ''}`}></div>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 z-10" size={20} />
                                        <input
                                            type="text"
                                            name="userId"
                                            placeholder="User ID"
                                            value={formData.userId}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('userId')}
                                            onBlur={() => setFocusedField('')}
                                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="relative group">
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-30' : ''}`}></div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 z-10" size={20} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField('')}
                                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="relative group">
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-30' : ''}`}></div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 z-10" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField('')}
                                            className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Admin Code Field */}
                                <div className="relative group">
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'adminCode' ? 'opacity-30' : ''}`}></div>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 z-10" size={20} />
                                        <input
                                            type="password"
                                            name="adminCode"
                                            placeholder="Admin Code"
                                            value={formData.adminCode}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('adminCode')}
                                            onBlur={() => setFocusedField('')}
                                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-lg"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <span className="relative">
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            'Register Admin'
                                        )}
                                    </span>
                                </button>

                                {/* Login Link */}
                                <div className="text-center pt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate.push('/admin/login')}
                                        className="text-gray-200 hover:text-white transition-colors duration-200 underline decoration-purple-400 underline-offset-4 text-lg"
                                    >
                                        Already have an account? Login here
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default AdminRegister;