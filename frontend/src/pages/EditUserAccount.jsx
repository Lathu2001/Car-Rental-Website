import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Home, CreditCard, Edit3, Save, X, ArrowLeft, Lock } from 'lucide-react';
import API_BASE_URL from '../config/api';

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

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        axios.get(`${API_BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setUserData(res.data);
        }).catch(err => {
            console.error("❌ Error fetching user data:", err);
            navigate('/login');
        });
    }, [navigate]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            // Update profile info
            await axios.put(`${API_BASE_URL}/api/users/update`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // If password fields are filled, send change-password request
            if (passwordData.currentPassword && passwordData.newPassword) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    alert("❌ New passwords do not match!");
                    setIsLoading(false);
                    return;
                }

                await axios.put(`${API_BASE_URL}/api/users/change-password`, passwordData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("✅ Password updated successfully!");
            }

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
            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold">Edit Your Profile</h1>
                        <p className="text-gray-600">Update your account information and password</p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* User Info Fields */}
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
                                                        <Icon className="h-5 w-5 text-gray-700" />
                                                    </div>
                                                    <input
                                                        type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                                                        name={field}
                                                        value={userData[field] || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-3 border rounded-xl"
                                                        placeholder={`Enter your ${getFieldLabel(field).toLowerCase()}`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Change Password Section */}
                                <div className="mt-8">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-blue-600" /> Change Password
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Current Password"
                                            className="w-full px-4 py-3 border rounded-xl"
                                        />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="New Password"
                                            className="w-full px-4 py-3 border rounded-xl"
                                        />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm New Password"
                                            className="w-full px-4 py-3 border rounded-xl md:col-span-2"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/user-dashboard')}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl"
                                    >
                                        Cancel
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
