import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import { MoreVertical, User, LogOut, Menu, X, Home, Car, Book } from "lucide-react";
import axios from "axios";
import logo from "../../assets/Images/logo.png";

function UserHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        }
      } catch (e) {
        console.error("Failed to fetch user data:", e);
      }
    })();
  }, []);

  // Scroll styling
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

  // Body scroll lock for mobile drawer
  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const firstFocusable = drawerRef.current?.querySelector("a,button");
      firstFocusable?.focus();
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileMenuOpen]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((v) => !v);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);

  const currentPath = location.pathname;
  const isActiveRoute = (path) => currentPath === path;

  const navItems = [
    { path: "/user-home", label: "Dashboard", icon: Home },
    { path: "/user-dashboard", label: "Fleet", icon: Car },
    { path: "/my-booking", label: "Booking", icon: Book },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/20"
            : "bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/user-home" className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={logo}
                  alt="ISGA Logo"
                  className="h-10 w-auto sm:h-12 lg:h-14 mr-1 sm:mr-2 transition-transform duration-300 hover:scale-105 rounded-lg"
                />
                <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" />
              </div>
              <div className="ml-1 sm:ml-2 min-w-0">
                <h1
                  className={`font-bold text-base sm:text-2xl lg:text-3xl truncate ${
                    scrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  ISGA ENTERPRISE
                </h1>
                <p className={`text-xs sm:text-sm font-medium truncate ${scrolled ? "text-gray-500" : "text-blue-200"}`}>
                  {/* reserved for tagline if needed */}
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <ul className="flex space-x-1 xl:space-x-2 items-center">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        aria-current={active ? "page" : undefined}
                        className={`relative flex items-center gap-2 px-4 xl:px-5 py-2.5 rounded-2xl font-semibold text-sm xl:text-base transition-all ${
                          active
                            ? scrolled
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow border border-blue-100"
                              : "bg-white/20 text-white shadow backdrop-blur-sm border border-white/20"
                            : scrolled
                            ? "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
                            : "text-blue-100 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                        {active && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
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
                  aria-expanded={dropdownOpen}
                  className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl transition-colors ${
                    scrolled ? "text-gray-700 hover:text-blue-700 hover:bg-gray-100" : "text-blue-100 hover:bg-white/10"
                  }`}
                >
                  <div className="w-8 h-8 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <User size={16} className="text-white" />
                  </div>
                  <MoreVertical size={16} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <User size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-base sm:text-lg text-gray-900 truncate">
                            {user?.name || user?.fullName || user?.firstName || user?.username || "User Name"}
                          </p>
                          <p className="text-sm sm:text-base text-gray-600 truncate">
                            {user?.email || user?.emailAddress || "user@email.com"}
                          </p>
                          <span className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Online
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/profile");
                        }}
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <User size={18} className="text-gray-500" />
                        <span className="text-sm sm:text-base">Account Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to sign out?")) {
                            sessionStorage.removeItem("token");
                            window.location.href = "/";
                          }
                        }}
                        className="flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut size={18} className="text-red-500" />
                        <span className="text-sm sm:text-base">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                aria-expanded={mobileMenuOpen}
                aria-controls="user-mobile-menu"
                className={`lg:hidden p-2 rounded-xl transition-colors ${
                  scrolled ? "text-gray-700 hover:text-blue-700 hover:bg-gray-100" : "text-blue-100 hover:bg-white/10"
                }`}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        id="user-mobile-menu"
        ref={drawerRef}
        className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <button
          onClick={toggleMobileMenu}
          className={`absolute inset-0 bg-black/40 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-opacity`}
          aria-label="Close menu"
        />

        {/* Panel */}
        <div className="absolute right-0 top-0 h-full w-[86%] sm:w-[70%] bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <span className="font-semibold text-gray-800">Menu</span>
            <button onClick={toggleMobileMenu} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          <nav className="p-3 overflow-y-auto">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActiveRoute(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={toggleMobileMenu}
                      className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-medium ${
                        active
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100"
                          : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16 sm:h-20" />
    </>
  );
}

export default UserHeader;
