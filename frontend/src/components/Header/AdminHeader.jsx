import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MoreVertical,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Car,
  Users,
  Star,
  Book,
} from "lucide-react";
import logo from '../../assets/Images/logo.png';

function AdminHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch admin data from original source
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    axios.get('http://localhost:5000/api/admin/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setAdmin(res.data);
    })
    .catch(err => {
      console.error("❌ Error fetching admin:", err);
      setError("Failed to load admin data. Please login again.");
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    });
  }, [navigate]);

  // Detect scroll for header background change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const currentPath = location.pathname;

  const navItems = [
    //{ path: "/admin-home", label: "Dashboard", icon: Home },
    { path: "/admin-dashboard", label: "Fleet", icon: Car },
    { path: "/user-detail", label: "Users", icon: Users },
    { path: "/User-Rewiews", label: "Reviews", icon: Star },
    { path: "/All-bookings", label: "Bookings", icon: Book },
  ];

  const isActiveRoute = (path) => currentPath === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/20"
            : "bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <div className="flex items-center group cursor-pointer">
                <div className="relative flex-shrink-0">
                  <img
                    src={logo}
                    alt="ISGA Holdings Logo"
                    className="h-16 w-auto sm:h-12 sm:w-12 lg:h-16 lg:w-16 mr-2 sm:mr-4 transition-all duration-300 group-hover:opacity-90 group-hover:scale-105 shadow-lg rounded-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <div className="ml-1 sm:ml-2 min-w-0">
                  <h1
                    className={`font-bold text-lg sm:text-2xl lg:text-3xl transition-all duration-300 truncate ${
                      scrolled ? "text-gray-900" : "text-white"
                    }`}
                  >
                    ISGA ENTERPRISE
                  </h1>
                  <p
                    className={`text-sm sm:text-base lg:text-lg font-medium transition-all duration-300 truncate ${
                      scrolled ? "text-gray-500" : "text-blue-200"
                    }`}
                  >
                    Admin Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <ul className="flex space-x-1 xl:space-x-2 items-center">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`relative flex items-center space-x-2 xl:space-x-3 px-3 xl:px-6 py-2 xl:py-3 rounded-xl xl:rounded-2xl font-semibold text-sm xl:text-lg transition-all duration-300 group ${
                          isActiveRoute(item.path)
                            ? scrolled
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-lg border border-blue-100"
                              : "bg-white/20 text-white shadow-xl backdrop-blur-sm border border-white/20"
                            : scrolled
                            ? "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
                            : "text-blue-100 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                        }`}
                      >
                        <Icon size={18} className="xl:w-6 xl:h-6" />
                        <span className="text-sm xl:text-lg">{item.label}</span>
                        {isActiveRoute(item.path) && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 xl:w-6 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right section */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                    scrolled
                      ? "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
                      : "text-blue-100 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                  }`}
                >
                  <div className="w-8 h-8 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <User size={16} className="text-white" />
                  </div>
                  <MoreVertical size={16} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <User size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-gray-900 truncate">
                            {admin?.name || "Admin User"}
                          </p>
                          <p className="text-base text-gray-600 truncate">
                            {admin?.email || "admin@isga.com"}
                          </p>
                          <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full inline-block">
                            Online
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 w-full text-left"
                      >
                        <User size={18} className="text-gray-500 group-hover:text-blue-600" />
                        <span className="text-base">Account Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to sign out?")) {
                            localStorage.removeItem("adminToken");
                            window.location.href = "/";
                          }
                        }}
                        className="flex items-center space-x-4 px-6 py-4 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 w-full text-left"
                      >
                        <LogOut size={18} className="text-red-500" />
                        <span className="text-base">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleMobileMenu}
                className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                  scrolled
                    ? "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
                    : "text-blue-100 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                }`}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>
          <div className="fixed top-16 sm:top-20 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="p-4 sm:p-6 space-y-3">
              <ul className="flex flex-col space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={toggleMobileMenu}
                        className={`flex items-center space-x-4 px-4 py-4 rounded-2xl text-lg transition-all duration-300 ${
                          isActiveRoute(item.path)
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-lg border border-blue-100"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}

export default AdminHeader;