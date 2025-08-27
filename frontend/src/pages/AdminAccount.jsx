import React, { useEffect, useState } from 'react';
import { User, Mail, Settings, Edit3, Save, X, Shield, KeyRound } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const AdminAccount = () => {
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({ name: '', userId: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin/login'); return; }

    axios.get(`${API_BASE_URL}/api/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setAdmin(res.data);
        setFormData({
          name: res.data.name || '',
          userId: res.data.userId || '',
          email: res.data.email || ''
        });
      })
      .catch(err => {
        console.error('Error fetching admin:', err);
        setError('Failed to load admin data. Please login again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    axios.put(`${API_BASE_URL}/api/admin/update`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setAdmin(res.data);
      setEditMode(false);
      setSuccess('Admin profile updated successfully.');
      setTimeout(() => setSuccess(''), 2500);
    })
    .catch(err => {
      console.error('Update error:', err);
      setError('Failed to update admin profile.');
      setTimeout(() => setError(''), 2500);
    })
    .finally(() => setIsLoading(false));
  };

  if (!admin) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} relative overflow-hidden`}>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-lg rounded-3xl p-8 border ${isDarkMode ? 'border-white/20' : 'border-white/40'}`}>
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-white' : 'border-purple-600'} mx-auto`} />
            <p className={`${isDarkMode ? 'text-white' : 'text-gray-700'} mt-4 text-center`}>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} relative overflow-hidden`}>
      {/* Top-right buttons */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate('/admin-change-password')}
          title="Change Password"
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-medium ${
            isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/80 text-gray-700 hover:bg-white'
          } backdrop-blur-lg border ${isDarkMode ? 'border-white/20' : 'border-white/40'} transition-all`}
        >
          <KeyRound className="w-5 h-5" />
          <span className="hidden sm:inline">Change Password</span>
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2.5 sm:p-3 rounded-full ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/80 text-gray-700 hover:bg-white'} backdrop-blur-lg border ${isDarkMode ? 'border-white/20' : 'border-white/40'} transition-all`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className={`inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 ${isDarkMode ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-gradient-to-r from-purple-400 to-cyan-400'} rounded-2xl mb-4`}>
              <Shield className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
            </div>
            <h1 className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Admin Dashboard</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm sm:text-base`}>Manage your administrator profile</p>
          </div>

          {/* Main Card */}
          <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/85'} backdrop-blur-xl rounded-3xl p-6 sm:p-8 border ${isDarkMode ? 'border-white/20' : 'border-white/40'} shadow-2xl`}>
            {/* Alerts */}
            {error && (
              <div className={`mb-6 p-4 ${isDarkMode ? 'bg-red-500/20 border-red-500/30 text-red-100' : 'bg-red-50 border-red-200 text-red-800'} border rounded-xl`}>
                <div className="flex items-center">
                  <X className="w-5 h-5 mr-2" />
                  {error}
                </div>
              </div>
            )}
            {success && (
              <div className={`mb-6 p-4 ${isDarkMode ? 'bg-green-500/20 border-green-500/30 text-green-100' : 'bg-green-50 border-green-200 text-green-800'} border rounded-xl`}>
                <div className="flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  {success}
                </div>
              </div>
            )}

            {/* Profile Form */}
            <div className="space-y-5 sm:space-y-6">
              {/* Name */}
              <div>
                <label className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium mb-2`}>
                  <User className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled={!editMode}
                  onChange={handleChange}
                  className={`w-full ${isDarkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'} border ${editMode ? (isDarkMode ? 'border-purple-400/50 focus:border-purple-400' : 'border-purple-300 focus:border-purple-500') : (isDarkMode ? 'border-white/20' : 'border-gray-300')} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-purple-400/30' : 'focus:ring-purple-400/40'} ${!editMode && 'cursor-not-allowed opacity-80'}`}
                  placeholder="Enter your full name"
                />
              </div>

              {/* User ID */}
              <div>
                <label className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium mb-2`}>
                  <Settings className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-cyan-300' : 'text-cyan-500'}`} />
                  User ID
                </label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  disabled={!editMode}
                  onChange={handleChange}
                  className={`w-full ${isDarkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'} border ${editMode ? (isDarkMode ? 'border-cyan-400/50 focus:border-cyan-400' : 'border-cyan-300 focus:border-cyan-500') : (isDarkMode ? 'border-white/20' : 'border-gray-300')} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-cyan-400/30' : 'focus:ring-cyan-400/40'} ${!editMode && 'cursor-not-allowed opacity-80'}`}
                  placeholder="Enter your user ID"
                />
              </div>

              {/* Email */}
              <div>
                <label className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium mb-2`}>
                  <Mail className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-pink-300' : 'text-pink-500'}`} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={!editMode}
                  onChange={handleChange}
                  className={`w-full ${isDarkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'} border ${editMode ? (isDarkMode ? 'border-pink-400/50 focus:border-pink-400' : 'border-pink-300 focus:border-pink-500') : (isDarkMode ? 'border-white/20' : 'border-gray-300')} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-pink-400/30' : 'focus:ring-pink-400/40'} ${!editMode && 'cursor-not-allowed opacity-80'}`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-7">
              {editMode ? (
                <>
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-green-400/50 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" /> Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({ name: admin.name || '', userId: admin.userId || '', email: admin.email || '' });
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-400/50 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/50 flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-5 h-5" /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center mt-6 text-xs sm:text-sm`}>
            Secure admin panel • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
