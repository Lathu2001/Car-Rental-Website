import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Car, LogIn } from "lucide-react";
import logo from "../../assets/Images/logo.png";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);

  // Detect scroll for header background change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open + focus first link
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

  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);

  const currentPath = location.pathname;
  const isActiveRoute = (path) => currentPath === path;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/Car", label: "Cars", icon: Car },
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
            {/* LEFT: Logo only */}
            <Link
              to="/"
              className="flex items-center min-w-0"
              aria-label="Go to home"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={logo}
                  alt="ISGA Enterprise Logo"
                  className="h-10 w-auto sm:h-12 lg:h-14 mr-2 transition-transform duration-300 hover:scale-105 rounded-lg"
                />
                <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" />
              </div>
              <div className="ml-1 sm:ml-2 min-w-0">
                <h1
                  className={`font-bold text-base sm:text-xl lg:text-2xl truncate ${
                    scrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  ISGA ENTERPRISE
                </h1>
                <p
                  className={`text-xs sm:text-sm lg:text-base font-medium truncate ${
                    scrolled ? "text-gray-500" : "text-blue-200"
                  }`}
                >
                  Car Rental Services
                </p>
              </div>
            </Link>

            {/* RIGHT: Desktop Nav (Home & Cars) + Login */}
            <div className="hidden lg:flex items-center gap-3">
              <nav className="flex">
                <ul className="flex items-center gap-1 xl:gap-2">
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

              {/* Login only (Register removed) */}
              <Link
                to="/login"
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  scrolled
                    ? "border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
                    : "border-2 border-white text-white hover:bg-white hover:text-blue-900"
                }`}
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                scrolled
                  ? "text-gray-700 hover:text-blue-700 hover:bg-gray-100"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
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
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-3 overflow-y-auto">
            {/* Navigation Links */}
            <ul className="flex flex-col gap-2 mb-4">
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

            {/* Auth Buttons - Mobile (Login only) */}
            <div className="mt-auto border-t pt-3 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={toggleMobileMenu}
                className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-base font-semibold border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20" />
    </>
  );
}

export default Header;
