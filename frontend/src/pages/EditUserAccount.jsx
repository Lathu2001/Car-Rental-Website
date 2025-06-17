import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Home, CreditCard, Edit3, Save, X, ArrowLeft } from 'lucide-react';

export default function EditUserAccount() {
    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: '',
        city: '',
        address: '',
        NICNumber: '',
        phoneNumber: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        axios.get('http://localhost:5000/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            setUserData(res.data);
        }).catch(err => {
            console.error("❌ Error fetching user data:", err);
            navigate('/login');
        });
    }, [navigate]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/users/update', userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Account updated successfully!");
            navigate('/user-dashboard');
        } catch (err) {
            console.error("❌ Error updating account:", err);
            alert("Failed to update account.");
        } finally {
            setIsLoading(false);
        }
    };

    const getFieldIcon = (field) => {
        const icons = {
            name: User,
            username: Edit3,
            email: Mail,
            city: MapPin,
            address: Home,
            NICNumber: CreditCard,
            phoneNumber: Phone
        };
        return icons[field] || User;
    };

    const getFieldLabel = (field) => {
        const labels = {
            name: 'Full Name',
            username: 'Username',
            email: 'Email Address',
            city: 'City',
            address: 'Address',
            NICNumber: 'NIC Number',
            phoneNumber: 'Phone Number'
        };
        return labels[field] || field;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-ping duration-1000"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                            Edit Your Profile
                        </h1>
                        <p className="text-gray-600">Update your account information</p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['name', 'username', 'email', 'city', 'address', 'NICNumber', 'phoneNumber'].map((field) => {
                                        const Icon = getFieldIcon(field);
                                        return (
                                            <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    {getFieldLabel(field)}
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Icon className="h-5 w-5 text-gray-700 group-focus-within:text-blue-600 transition-colors duration-200" />
                                                    </div>
                                                    <input
                                                        type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                                                        name={field}
                                                        value={userData[field] || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-900 backdrop-blur-sm hover:bg-gray-50 focus:bg-white"
                                                        placeholder={`Enter your ${getFieldLabel(field).toLowerCase()}`}
                                                    />
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-focus-within:from-blue-500/10 group-focus-within:via-purple-500/5 group-focus-within:to-blue-500/10 transition-all duration-300 pointer-events-none" />
                                                </div>
                                                {errors[field] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                        <div className="relative flex items-center justify-center space-x-2">
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Save className="w-5 h-5" />
                                            )}
                                            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                                        </div>
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => navigate('/user-dashboard')}
                                        className="flex-1 sm:flex-none group relative overflow-hidden bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg border border-gray-200"
                                    >
                                        <div className="relative flex items-center justify-center space-x-2">
                                            <X className="w-5 h-5" />
                                            <span>Cancel</span>
                                        </div>
                                    </button>
                                </div>

                                {/* Back to Dashboard Link */}
                                <div className="text-center pt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/user-dashboard')}
                                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                                    >
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                                        <span>Back to Dashboard</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}