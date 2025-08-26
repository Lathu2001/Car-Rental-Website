import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export default function AdminResetPassword() {
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
      await axios.post(`${API_BASE_URL}/api/admin/reset-password/${token}`, {
        password: form.password,
      });
      setStatus({ loading: false, ok: true, error: '' });
      setTimeout(() => navigate('/admin-login'), 1500);
    } catch (err) {
      setStatus({
        loading: false,
        ok: false,
        error: err?.response?.data?.message || 'Reset failed. The link may have expired.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20" />
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Set a new admin password</h2>
          <p className="text-blue-200">Enter and confirm your new password</p>
        </div>

        {status.ok && (
          <div className="mb-4 text-sm text-green-200 bg-green-900/30 border border-green-400/40 rounded p-3">
            Password updated! Redirecting to admin login…
          </div>
        )}
        {status.error && (
          <div className="mb-4 text-sm text-red-200 bg-red-900/30 border border-red-400/40 rounded p-3">
            {status.error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="New password"
              required
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={onChange}
              placeholder="Confirm password"
              required
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className={`w-full py-3 rounded-2xl font-semibold text-white transition-all ${
              status.loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700'
            }`}
          >
            {status.loading ? 'Updating…' : 'Update password'}
          </button>

          <div className="text-center text-sm mt-2">
            <Link to="/admin-login" className="text-blue-300 hover:text-white underline">
              Back to Admin Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
