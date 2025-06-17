import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Car,
  Info,
  LogIn,
  UserPlus,
} from "lucide-react";
import logo from '../../assets/Images/logo.png';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll for header background change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const currentPath = location.pathname;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/Car", label: "Cars", icon: Car },
   // { path: "/about", label: "About Us", icon: Info },
  ];

  const authItems = [
    { path: "/login", label: "Login", icon: LogIn, variant: "outline" },
    { path: "/register", label: "Register", icon: UserPlus, variant: "solid" },
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
                    className="h-12 w-auto sm:h-14 lg:h-16 mr-2 sm:mr-4 transition-all duration-300 group-hover:opacity-90 group-hover:scale-105 shadow-lg rounded-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <div className="ml-1 sm:ml-2 min-w-0">
                  <h1
                    className={`font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl transition-all duration-300 truncate ${
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
                    Car Rental Services
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

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              {authItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center space-x-2 px-4 xl:px-6 py-2 xl:py-3 rounded-xl xl:rounded-2xl font-semibold text-sm xl:text-base transition-all duration-300 group ${
                      item.variant === "solid"
                        ? scrolled
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                          : "bg-white text-blue-900 shadow-lg hover:shadow-xl hover:scale-105"
                        : scrolled
                        ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        : "border-2 border-white text-white hover:bg-white hover:text-blue-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
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
              {/* Navigation Links */}
              <ul className="flex flex-col space-y-3 mb-6">
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

              {/* Auth Buttons - Mobile */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                {authItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={toggleMobileMenu}
                      className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${
                        item.variant === "solid"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                          : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}

export default Header;