import React, { useEffect, useState } from 'react';
import { User, Mail, Settings, Edit3, Save, X, Shield } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAccount = () => {
    const [admin, setAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        userId: '',
        email: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        axios.get('http://localhost:5000/api/admin/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setAdmin(res.data);
            setFormData({
                name: res.data.name || '',
                userId: res.data.userId || '',
                email: res.data.email || ''
            });
        })
        .catch(err => {
            console.error("❌ Error fetching admin:", err);
            setError("Failed to load admin data. Please login again.");
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
        });
    }, [navigate]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleUpdate = () => {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        axios.put('http://localhost:5000/api/admin/update', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setAdmin(res.data);
            setEditMode(false);
            setSuccess("Admin profile updated successfully.");
            setTimeout(() => setSuccess(''), 3000);
        })
        .catch(err => {
            console.error("❌ Update error:", err);
            setError("Failed to update admin profile.");
            setTimeout(() => setError(''), 3000);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    if (!admin) {
        return (
            <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} relative overflow-hidden`}>
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDarkMode ? 'bg-purple-500' : 'bg-purple-300'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse`}></div>
                    <div className={`absolute top-1/3 right-1/4 w-96 h-96 ${isDarkMode ? 'bg-cyan-500' : 'bg-cyan-300'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000`}></div>
                    <div className={`absolute bottom-1/4 left-1/3 w-96 h-96 ${isDarkMode ? 'bg-pink-500' : 'bg-pink-300'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000`}></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-lg rounded-3xl p-8 border ${isDarkMode ? 'border-white/20' : 'border-white/40'}`}>
                        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-white' : 'border-purple-600'} mx-auto`}></div>
                        <p className={`${isDarkMode ? 'text-white' : 'text-gray-700'} mt-4 text-center`}>Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} relative overflow-hidden`}>
            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-20">
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-3 rounded-full ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/80 text-gray-700 hover:bg-white'} backdrop-blur-lg border ${isDarkMode ? 'border-white/20' : 'border-white/40'} transition-all duration-300`}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDarkMode ? 'bg-purple-500' : 'bg-purple-300'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse`}></div>
                <div className={`absolute top-1/3 right-1/4 w-96 h-96 ${isDarkMode ? 'bg-cyan-500' : 'bg-cyan-300'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000`}></div>
                <div className={`absolute bottom-1/4 left-1/3 w-96 h-96 ${isDarkMode ? 'bg-pink-500' : 'bg-pink-300'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000`}></div>
                
                {/* Floating particles */}
                <div className={`absolute top-20 left-20 w-2 h-2 ${isDarkMode ? 'bg-white' : 'bg-purple-400'} rounded-full opacity-30 animate-bounce animation-delay-1000`}></div>
                <div className={`absolute top-40 right-40 w-1 h-1 ${isDarkMode ? 'bg-cyan-300' : 'bg-cyan-500'} rounded-full opacity-40 animate-bounce animation-delay-3000`}></div>
                <div className={`absolute bottom-40 left-40 w-3 h-3 ${isDarkMode ? 'bg-purple-300' : 'bg-purple-500'} rounded-full opacity-20 animate-bounce animation-delay-5000`}></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-20 h-20 ${isDarkMode ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-gradient-to-r from-purple-400 to-cyan-400'} rounded-2xl mb-4`}>
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Admin Dashboard</h1>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Manage your administrator profile</p>
                    </div>

                    {/* Main Card */}
                    <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-xl rounded-3xl p-8 border ${isDarkMode ? 'border-white/20' : 'border-white/40'} shadow-2xl`}>
                        {/* Alert Messages */}
                        {error && (
                            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-red-500/20 border-red-500/30 text-red-100' : 'bg-red-100/80 border-red-300/50 text-red-800'} border rounded-xl animate-fade-in`}>
                                <div className="flex items-center">
                                    <X className="w-5 h-5 mr-2" />
                                    {error}
                                </div>
                            </div>
                        )}
                        
                        {success && (
                            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-green-500/20 border-green-500/30 text-green-100' : 'bg-green-100/80 border-green-300/50 text-green-800'} border rounded-xl animate-fade-in`}>
                                <div className="flex items-center">
                                    <Save className="w-5 h-5 mr-2" />
                                    {success}
                                </div>
                            </div>
                        )}

                        {/* Profile Form */}
                        <div className="space-y-6">
                            {/* Name Field */}
                            <div className="group">
                                <label className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium mb-2`}>
                                    <User className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`} />
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        disabled={!editMode}
                                        onChange={handleChange}
                                        className={`w-full ${isDarkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white/60 text-gray-800 placeholder-gray-500'} border ${editMode ? (isDarkMode ? 'border-purple-400/50 focus:border-purple-400' : 'border-purple-400/60 focus:border-purple-500') : (isDarkMode ? 'border-white/20' : 'border-gray-300/60')} rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-purple-400/30' : 'focus:ring-purple-400/40'} ${!editMode && 'cursor-not-allowed opacity-70'}`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* User ID Field */}
                            <div className="group">
                                <label className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium mb-2`}>
                                    <Settings className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-cyan-300' : 'text-cyan-500'}`} />
                                    User ID
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="userId"
                                        value={formData.userId}
                                        disabled={!editMode}
                                        onChange={handleChange}
                                        className={`w-full ${isDarkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white/60 text-gray-800 placeholder-gray-500'} border ${editMode ? (isDarkMode ? 'border-cyan-400/50 focus:border-cyan-400' : 'border-cyan-400/60 focus:border-cyan-500') : (isDarkMode ? 'border-white/20' : 'border-gray-300/60')} rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-cyan-400/30' : 'focus:ring-cyan-400/40'} ${!editMode && 'cursor-not-allowed opacity-70'}`}
                                        placeholder="Enter your user ID"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="group">
                                <label className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium mb-2`}>
                                    <Mail className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-pink-300' : 'text-pink-500'}`} />
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled={!editMode}
                                        onChange={handleChange}
                                        className={`w-full ${isDarkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white/60 text-gray-800 placeholder-gray-500'} border ${editMode ? (isDarkMode ? 'border-pink-400/50 focus:border-pink-400' : 'border-pink-400/60 focus:border-pink-500') : (isDarkMode ? 'border-white/20' : 'border-gray-300/60')} rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-pink-400/30' : 'focus:ring-pink-400/40'} ${!editMode && 'cursor-not-allowed opacity-70'}`}
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            {editMode ? (
                                <>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isLoading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                name: admin.name,
                                                userId: admin.userId,
                                                email: admin.email
                                            });
                                        }}
                                        disabled={isLoading}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400/50 disabled:opacity-50 flex items-center justify-center"
                                    >
                                        <X className="w-5 h-5 mr-2" />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 flex items-center justify-center"
                                >
                                    <Edit3 className="w-5 h-5 mr-2" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                            Secure admin panel • Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-3000 {
                    animation-delay: 3s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                .animation-delay-5000 {
                    animation-delay: 5s;
                }
            `}</style>
        </div>
    );
};

export default AdminAccount;