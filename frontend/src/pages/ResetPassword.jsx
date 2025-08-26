
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [status, setStatus] = useState({ loading: false, ok: false, error: '' });

  useEffect(() => {
    if (!token) {
      setStatus({ loading: false, ok: false, error: 'Invalid or missing token.' });
    }
  }, [token]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, ok: false, error: '' });

    if (form.password.length < 6) {
      setStatus({ loading: false, ok: false, error: 'Password must be at least 6 characters.' });
      return;
    }
    if (form.password !== form.confirm) {
      setStatus({ loading: false, ok: false, error: 'Passwords do not match.' });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
        password: form.password,
      });
      setStatus({ loading: false, ok: true, error: '' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setStatus({
        loading: false,
        ok: false,
        error:
          err?.response?.data?.message ||
          'Reset failed. The link may have expired.',
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/50 to-black/80"></div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative z-10 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Set a new password
          </h2>
          <p className="text-gray-600">Enter and confirm your new password</p>
        </div>

        {status.ok && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded p-3">
            Password updated! Redirecting to login…
          </div>
        )}
        {status.error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded p-3">
            {status.error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div className="relative">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="New password"
              aria-label="New password"
              required
              className="w-full p-4 rounded-xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="relative">
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={onChange}
              placeholder="Confirm password"
              aria-label="Confirm password"
              required
              className="w-full p-4 rounded-xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              status.loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:shadow-blue-500/25'
            } focus:outline-none focus:ring-4 focus:ring-blue-500/30`}
          >
            {status.loading ? 'Updating…' : 'Update password'}
          </button>

          <div className="text-center text-sm mt-2">
            <Link to="/login" className="text-blue-600 hover:text-purple-600 underline decoration-2 underline-offset-4">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
