import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Users, Filter, Eye } from 'lucide-react';

function AdminUserList() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [nicFilter, setNicFilter] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/users/all')
            .then(res => {
                setUsers(res.data);
                setFilteredUsers(res.data);
            })
            .catch(err => console.error("Error fetching users:", err));
    }, []);

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setNicFilter(value);

        const filtered = users.filter(user =>
            user.NICNumber && user.NICNumber.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                    <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-60"></div>
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
                <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-indigo-300 rounded-full animate-ping opacity-50 animation-delay-3000"></div>
                <div className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping opacity-60 animation-delay-5000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            User Management
                        </h1>
                        <p className="text-gray-600 text-lg">Manage and view all registered users</p>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-br from-green-500 to-teal-600 p-3 rounded-xl">
                                    <Filter className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Filtered Results</p>
                                    <p className="text-2xl font-bold text-gray-800">{filteredUsers.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
                        <div className="relative max-w-md mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by NIC Number..."
                                value={nicFilter}
                                onChange={handleFilterChange}
                                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Users Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <div 
                                    key={user._id}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* User Avatar */}
                                    <div className="flex justify-center mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    </div>
                                    
                                    {/* User Info */}
                                    <div className="text-center space-y-3">
                                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {user.name}
                                        </h3>
                                        
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-500">Email:</span>
                                                <span className="truncate ml-2" title={user.email}>{user.email}</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-500">Username:</span>
                                                <span className="truncate ml-2">{user.username}</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-500">Phone:</span>
                                                <span className="truncate ml-2">{user.phoneNumber}</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-500">City:</span>
                                                <span className="truncate ml-2">{user.city}</span>
                                            </div>
                                            
                                            <div className="pt-2 border-t border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-500">NIC:</span>
                                                    <span className="font-mono text-blue-600 font-semibold">{user.NICNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative gradient line */}
                                    <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                    <Search className="w-12 h-12 text-gray-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-medium text-gray-900 mb-2">No users found</p>
                                    <p className="text-gray-500">Try adjusting your search criteria</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-3000 {
                    animation-delay: 3s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                .animation-delay-5000 {
                    animation-delay: 5s;
                }
            `}</style>
        </div>
    );
}

export default AdminUserList;