import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import logo from '../../assets/Images/logo.png';

function AdminHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#1e3a8a' }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo with hover animation */}
          <div className="flex items-center mb-4 md:mb-0 group">
            <img 
              src={logo} 
              alt="ISGA Holdings Logo" 
              className="h-16 w-auto mr-4 transition-all duration-300 group-hover:opacity-90"
            />
            <h1 className="text-2xl font-bold text-white">ISGA ENTERPRISE</h1>
          </div>

          {/* Navigation */}
          <nav className="w-full md:w-auto">
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 items-center">
              <li>
                <Link 
                  to="/admin-home" 
                  className="text-white text-lg font-medium px-4 py-2 rounded transition-colors duration-300 hover:text-yellow-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin-dashboard" 
                  className="text-white text-lg font-medium px-4 py-2 rounded transition-colors duration-300 hover:text-yellow-300"
                >
                  Cars
                </Link>
              </li>
              <li>
                <Link 
                  to="/user-detail" 
                  className="text-white text-lg font-medium px-4 py-2 rounded transition-colors duration-300 hover:text-yellow-300"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link 
                  to="/User-Rewiews" 
                  className="text-white text-lg font-medium px-4 py-2 rounded transition-colors duration-300 hover:text-yellow-300"
                >
                  Review
                </Link>
              </li>
              <li className="relative mt-2 md:mt-0">
                <button
                  onClick={toggleDropdown}
                  className="text-white p-2 rounded-md border border-transparent transition-all duration-300 hover:border-yellow-300"
                >
                  <MoreVertical size={24} />
                </button>
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <li>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-blue-900 hover:bg-blue-100 hover:text-blue-800"
                      >
                        Account Details
                      </Link>
                    </li>
                    <li>
                    <button
                      onClick={() => {
                      const confirmSignOut = window.confirm("Are you sure you want to sign out?");
                      if (confirmSignOut) {
                       localStorage.removeItem("token");
                       window.location.href = "/";
                      }
                     }}
                     className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-800"
                    >
                       Sign Out
                    </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;