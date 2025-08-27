import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Home, CreditCard, Edit3, Save, X, Lock, Eye, EyeOff, ArrowLeft
} from 'lucide-react';
import API_BASE_URL from '../config/api';

/* Local toast (non-blocking) */
function Toast({ type = 'info', message, onClose }) {
  if (!message) return null;
  const bg =
    type === 'success' ? 'bg-green-600/90' :
    type === 'error'   ? 'bg-red-600/90'   :
                         'bg-slate-800/90';
  return (
    <div role="status" aria-live="polite" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white ${bg}`}>
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white text-xs underline">Close</button>
      </div>
    </div>
  );
}

export default function EditUserAccount() {
  const [userData, setUserData] = useState({
    name: '', username: '', email: '', city: '', address: '', NICNumber: '', phoneNumber: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  const [showPwd, setShowPwd] = useState({
    current: false, next: false, confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ type: 'info', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUserData(res.data || {});
    }).catch(err => {
      console.error('Error fetching user data:', err);
      navigate('/login');
    });
  }, [navigate]);

  const handleChange = (e) => setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const showToast = (message, type = 'info', ms = 1800) => {
    setToast({ message, type });
    const t = setTimeout(() => setToast({ message: '', type }), ms);
    return () => clearTimeout(t);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = sessionStorage.getItem('token');

    try {
      // Update profile info
      await axios.put(`${API_BASE_URL}/api/users/update`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle password change if provided
      const wantsPasswordChange = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword;
      if (wantsPasswordChange) {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
          showToast('Please fill current and new password.', 'error', 2000);
          setIsLoading(false);
          return;
        }
        if (passwordData.newPassword.length < 6) {
          showToast('New password must be at least 6 characters.', 'error', 2200);
          setIsLoading(false);
          return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          showToast('New passwords do not match.', 'error', 2200);
          setIsLoading(false);
          return;
        }

        await axios.put(`${API_BASE_URL}/api/users/change-password`, passwordData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Password updated successfully.', 'success');
      }

      showToast('Account updated successfully.', 'success');
      setTimeout(() => navigate('/user-dashboard'), 900);
    } catch (err) {
      console.error('Error updating account:', err);
      const msg = err?.response?.data?.message || 'Failed to update account.';
      showToast(msg, 'error', 2200);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldIcon = (field) => {
    const map = {
      name: User, username: Edit3, email: Mail, city: MapPin, address: Home, NICNumber: CreditCard, phoneNumber: Phone
    };
    return map[field] || User;
  };
  const getFieldLabel = (field) => {
    const map = {
      name: 'Full Name', username: 'Username', email: 'Email Address',
      city: 'City', address: 'Address', NICNumber: 'NIC Number', phoneNumber: 'Phone Number'
    };
    return map[field] || field;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '', type: toast.type })} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Edit Your Profile</h1>
          <p className="text-gray-600 text-sm sm:text-base">Update your account information and password</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {['name', 'username', 'email', 'city', 'address', 'NICNumber', 'phoneNumber'].map((field) => {
                  const Icon = getFieldIcon(field);
                  const isAddress = field === 'address';
                  return (
                    <div key={field} className={isAddress ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {getFieldLabel(field)}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Icon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                          type={
                            field === 'email' ? 'email' :
                            field === 'phoneNumber' ? 'tel' : 'text'
                          }
                          name={field}
                          value={userData[field] || ''}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          placeholder={`Enter your ${getFieldLabel(field).toLowerCase()}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Change Password Section */}
              <div className="mt-2">
                <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" /> Change Password
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  {/* Current */}
                  <div className="relative">
                    <input
                      type={showPwd.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Current Password"
                      className="w-full px-4 pr-11 py-3.5 border rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => ({ ...s, current: !s.current }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={showPwd.current ? 'Hide password' : 'Show password'}
                    >
                      {showPwd.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* New */}
                  <div className="relative">
                    <input
                      type={showPwd.next ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="New Password"
                      className="w-full px-4 pr-11 py-3.5 border rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => ({ ...s, next: !s.next }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={showPwd.next ? 'Hide password' : 'Show password'}
                    >
                      {showPwd.next ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Confirm (full width on md) */}
                  <div className="relative md:col-span-2">
                    <input
                      type={showPwd.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm New Password"
                      className="w-full px-4 pr-11 py-3.5 border rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => ({ ...s, confirm: !s.confirm }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={showPwd.confirm ? 'Hide password' : 'Show password'}
                    >
                      {showPwd.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-60`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/user-dashboard')}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  <X className="w-5 h-5" /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs sm:text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
