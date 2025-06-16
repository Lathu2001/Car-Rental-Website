import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Trash2, Mail, MapPin, Phone, CreditCard, Home, LogOut } from 'lucide-react';

export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:5000/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setUser(res.data))
        .catch(err => {
            console.error("❌ Error fetching user details:", err);
            setError("Failed to fetch user details. Please log in again.");
            localStorage.clear();
            navigate('/login');
        });
    }, [navigate]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account?");
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:5000/api/users/delete', {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.clear();
            alert("Account deleted successfully.");
            navigate('/register');
        } catch (err) {
            console.error("❌ Error deleting account:", err);
            alert("Failed to delete account.");
        } finally {
            setIsDeleting(false);
        }
    };

    const goToEditPage = () => {
        navigate('/edit-user-account');
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-red-200">
                    <div className="text-red-600 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-lg font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-300"></div>
                    <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 z-10">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="text-lg font-medium text-gray-700">Loading user details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-300/30 to-indigo-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-300"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-300/30 to-teal-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
                
                {/* Animated Grid */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent bg-[length:100px_100px] opacity-30 animate-pulse"></div>
                
                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400/40 rounded-full animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-2xl">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Welcome Back!
                        </h1>
                        <p className="text-gray-600 text-lg">Manage your account with style</p>
                    </div>

                    {/* Dashboard Card */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 p-8 border-b border-gray-200/50">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">User Dashboard</h2>
                                    <p className="text-gray-600">Your personal information</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 rounded-xl transition-all duration-300 border border-red-200 hover:scale-105"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>

                        {/* User Info Grid */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Personal Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Full Name</p>
                                            <p className="text-gray-800 font-semibold">{user.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Username</p>
                                            <p className="text-gray-800 font-semibold">{user.username}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="text-gray-800 font-semibold">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="text-gray-800 font-semibold">{user.phoneNumber || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Additional Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">City</p>
                                            <p className="text-gray-800 font-semibold">{user.city || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                                            <Home className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="text-gray-800 font-semibold">{user.address || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                                            <CreditCard className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">NIC Number</p>
                                            <p className="text-gray-800 font-semibold">{user.NICNumber || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    {/* Stats Card */}
                                    <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl border border-emerald-200 shadow-sm">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-emerald-700">Active</div>
                                            <div className="text-sm text-emerald-600">Account Status</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={goToEditPage}
                                    className="group flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                    <span>Edit Account</span>
                                </button>
                                
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="group flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className={`w-5 h-5 transition-transform duration-300 ${isDeleting ? 'animate-pulse' : 'group-hover:shake'}`} />
                                    <span>{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
                                <p className="text-gray-500 text-sm">
                                    Last updated: {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
                .group:hover .group-hover\\:shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}