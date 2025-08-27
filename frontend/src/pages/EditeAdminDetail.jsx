import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, User, Save, X, Eye, EyeOff } from 'lucide-react';
import API_BASE_URL from '../config/api';

/* Local toast */
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

function EditAdminDetail() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ type: 'info', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API_BASE_URL}/api/admins/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({ name: response.data?.name || '', email: response.data?.email || '', password: '' });
      } catch (err) {
        console.error('Failed to load admin details:', err);
      }
    };
    fetchAdmin();
  }, []);

  const showToast = (message, type = 'info', ms = 1800) => {
    setToast({ message, type });
    const t = setTimeout(() => setToast({ message: '', type }), ms);
    return () => clearTimeout(t);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API_BASE_URL}/api/admins/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Admin details updated successfully.', 'success');
      setTimeout(() => navigate('/admin/account'), 900);
    } catch (err) {
      console.error('Update failed:', err?.response?.data || err);
      showToast(err?.response?.data?.message || 'Update failed', 'error', 2200);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-10">
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ message: '', type: toast.type })} />

      <div className="w-full max-w-xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl shadow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3">Edit Admin Profile</h2>
          <p className="text-gray-600 text-sm">Update your details (password optional)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Password (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password (optional)</label>
            <div className="relative">
              <input
                name="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-4 pr-11 py-3.5 border rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPwd(s => !s)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60"
            >
              {isSaving ? (
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
              onClick={() => navigate('/admin/account')}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              <X className="w-5 h-5" /> Cancel
            </button>
          </div>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default EditAdminDetail;
