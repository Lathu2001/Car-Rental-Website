import { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 p-6">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Registered Users</h2>

                <div className="mb-6 flex justify-end">
                    <input
                        type="text"
                        placeholder="Filter by NIC Number"
                        value={nicFilter}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-sm text-center border border-gray-300">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 border">Name</th>
                                <th className="py-3 px-4 border">Email</th>
                                <th className="py-3 px-4 border">Username</th>
                                <th className="py-3 px-4 border">Phone</th>
                                <th className="py-3 px-4 border">City</th>
                                <th className="py-3 px-4 border">NIC Number</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-blue-50 transition-colors">
                                        <td className="py-2 px-4 border">{user.name}</td>
                                        <td className="py-2 px-4 border">{user.email}</td>
                                        <td className="py-2 px-4 border">{user.username}</td>
                                        <td className="py-2 px-4 border">{user.phoneNumber}</td>
                                        <td className="py-2 px-4 border">{user.city}</td>
                                        <td className="py-2 px-4 border">{user.NICNumber}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-4 text-gray-500">No users found with that NIC number.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminUserList;
