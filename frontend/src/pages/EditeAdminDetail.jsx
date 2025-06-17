import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditAdminDetail() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get('http://localhost:5000/api/admins/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({ ...response.data, password: '' }); // don't fill in password
      } catch (err) {
        console.error("Failed to load admin details:", err);
      }
    };

    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put('http://localhost:5000/api/admins/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Admin details updated successfully.");
      navigate('/admin/account');
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Admin Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="New Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditAdminDetail;
