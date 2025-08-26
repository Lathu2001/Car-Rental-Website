// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, Sparkles } from 'lucide-react';
import API_BASE_URL from '../config/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpLoading, setFpLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, formData);
      alert('Login successful');
      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin-dashboard');
    } catch (error) {
      alert(error?.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handlers
  const openForgot = () => {
    setFpEmail(formData.email || '');
    setShowForgot(true);
  };
  const closeForgot = () => {
    setShowForgot(false);
    setFpLoading(false);
  };
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!fpEmail || !fpEmail.includes('@')) {
      alert('Enter a valid admin email to receive the reset link.');
      return;
    }
    setFpLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/admin/forgot-password`, { email: fpEmail }, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('If that admin email exists, a reset link has been sent.');
      closeForgot();
    } catch (err) {
      alert(err?.response?.data?.message || 'Could not start password reset. Try again later.');
      setFpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Car Images */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-spin duration-[20s]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Login Container */}
      <div
        className={`w-full max-w-md transform transition-all duration-1000 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-pulse"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl shadow-xl mb-4 relative group">
              <Shield className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-blue-200 text-lg">Secure Administrative Access</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-blue-200 mb-2 group-focus-within:text-white transition-colors duration-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@isga.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-medium text-blue-200 mb-2 group-focus-within:text-white transition-colors duration-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Forgot link */}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={openForgot}
                  className="text-sm text-blue-300 hover:text-white underline decoration-2 underline-offset-4 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 relative overflow-hidden group ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Panel</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
            <p className="text-blue-200 text-sm">
              Don't have an Admin account?{' '}
              <a
                href="/register"
                className="text-blue-400 hover:text-white font-medium underline decoration-blue-400 hover:decoration-white transition-all duration-300"
              >
                Register Here
              </a>
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-blue-300">
              <Shield className="w-3 h-3" />
              <span>Secured by ISGA Enterprise</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={closeForgot}
              className="absolute right-3 top-3 p-2 rounded hover:bg-gray-100"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h2 className="text-xl font-semibold mb-2">Reset admin password</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter the admin email. We’ll send a reset link if the account exists.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  placeholder="admin@isga.com"
                  required
                  className="w-full p-3 border rounded-lg bg-white/80 outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={fpLoading}
                className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
                  fpLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                }`}
              >
                {fpLoading ? 'Sending…' : 'Send reset link'}
              </button>

              <div className="text-xs text-gray-500 text-center">
                You’ll receive a link like <code>/admin-reset-password/:token</code>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
