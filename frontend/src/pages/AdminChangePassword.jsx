import React, { useState } from 'react';
import { KeyRound, Save, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

export default function AdminChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword) {
      setMsg({ type: 'error', text: 'Please fill all fields.' });
      return;
    }
    if (newPassword.length < 8) {
      setMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirm) {
      setMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg({ type: 'success', text: res.data?.message || 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
      setTimeout(() => navigate('/account'), 1200);
    } catch (err) {
      console.error('❌ Change password error:', err);
      const text = err?.response?.data?.message || 'Failed to change password.';
      setMsg({ type: 'error', text });
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/80'} w-full max-w-md backdrop-blur-xl rounded-3xl p-8 border ${isDarkMode ? 'border-white/20' : 'border-white/40'} shadow-2xl`}>
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${isDarkMode ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-gradient-to-r from-purple-400 to-cyan-400'} rounded-2xl mb-3`}>
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Change Password</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Update your admin password securely</p>
          </div>

          {msg.text && (
            <div className={`mb-4 p-3 rounded-xl border ${msg.type === 'success'
              ? (isDarkMode ? 'bg-green-500/20 border-green-500/30 text-green-100' : 'bg-green-100/80 border-green-300/50 text-green-800')
              : (isDarkMode ? 'bg-red-500/20 border-red-500/30 text-red-100' : 'bg-red-100/80 border-red-300/50 text-red-800')}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className={`${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium mb-1 block`}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full ${isDarkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white/60 text-gray-800 placeholder-gray-500'} border ${isDarkMode ? 'border-white/20' : 'border-gray-300/60'} rounded-xl px-4 py-3 focus:outline-none`}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className={`${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium mb-1 block`}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full ${isDarkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white/60 text-gray-800 placeholder-gray-500'} border ${isDarkMode ? 'border-white/20' : 'border-gray-300/60'} rounded-xl px-4 py-3 focus:outline-none`}
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className={`${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium mb-1 block`}>Confirm New Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full ${isDarkMode ? 'bg-white/5 text-white placeholder-gray-400' : 'bg-white/60 text-gray-800 placeholder-gray-500'} border ${isDarkMode ? 'border-white/20' : 'border-gray-300/60'} rounded-xl px-4 py-3 focus:outline-none`}
                placeholder="Re-enter new password"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Save className="w-5 h-5 mr-2" />Save</>}
              </button>
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                <X className="w-5 h-5 mr-2" />Cancel
              </button>
            </div>
          </form>

          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-4`}>
            Tip: Use a strong passphrase with a mix of letters, numbers, and symbols.
          </p>
        </div>
      </div>
    </div>
  );
}
