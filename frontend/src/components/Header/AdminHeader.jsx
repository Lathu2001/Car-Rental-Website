import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from '../../config/api';
import {
  MoreVertical,
  User,
  LogOut,
  Menu,
  X,
  Car,
  Users,
  Star,
  Book,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  XCircle
} from "lucide-react";

import logo from '../../assets/Images/logo1.jpg';

/** ---------- Small helpers ---------- */
const BOOKINGS_API = `${API_BASE_URL}/api/bookings`;

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth   = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
const ymd = (d) => d.toISOString().slice(0,10); // YYYY-MM-DD
const sameDay = (a,b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

function buildMonthGrid(viewDate) {
  const first = startOfMonth(viewDate);
  const last = endOfMonth(viewDate);

  // calendar starts Monday: 1..7
  const weekday = (w) => (w === 0 ? 7 : w);
  const leading = weekday(first.getDay()) - 1; // days from prev month
  const trailing = 7 - weekday(last.getDay()); // days from next month (if any, 0..6)

  const gridStart = addDays(first, -leading);
  const total = leading + last.getDate() + (trailing === 7 ? 0 : trailing);
  const days = [];
  for (let i=0;i<total;i++) {
    const d = addDays(gridStart, i);
    days.push(d);
  }
  return days;
}

/** ---------- Calendar Modal ---------- */
function CalendarModal({ open, onClose, token }) {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [viewDate, setViewDate] = useState(() => new Date());

  // Fetch bookings when opened
  useEffect(() => {
    if (!open) return;
    let ignore = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(BOOKINGS_API, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (!ignore) setBookings(res.data || []);
      } catch (e) {
        if (!ignore) setError("Failed to load bookings.");
        console.error("Calendar bookings fetch error:", e?.response || e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [open, token]);

  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  // Build a Set of YYYY-MM-DD that are booked for quick highlight
  const bookedDatesSet = useMemo(() => {
    const set = new Set();
    bookings.forEach(b => {
      if (!b.startDate || !b.endDate) return;
      const s = new Date(b.startDate);
      const e = new Date(b.endDate);
      for (let d = new Date(s); d <= e; d = addDays(d, 1)) {
        set.add(ymd(d));
      }
    });
    return set;
  }, [bookings]);

  // Filter bookings that intersect the month for side-list
  const monthBookings = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    return bookings.filter(b => {
      const s = new Date(b.startDate);
      const e = new Date(b.endDate);
      return s <= end && e >= start; // overlapping
    });
  }, [bookings, viewDate]);

  const isCurrentMonth = (d) => d.getMonth() === viewDate.getMonth();

  const gotoPrev = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const gotoNext = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close calendar"
      />
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Bookings Calendar
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-200/60 text-gray-600"
            >
              <XCircle />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4">
            {/* Calendar left (2 cols on lg) */}
            <div className="lg:col-span-2 p-4">
              {/* Month controls */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={gotoPrev}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-700"
                  aria-label="Previous month"
                >
                  <ChevronLeft />
                </button>
                <div className="text-lg font-bold text-gray-800">
                  {viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                </div>
                <button
                  onClick={gotoNext}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-700"
                  aria-label="Next month"
                >
                  <ChevronRight />
                </button>
              </div>

              {/* Weekday header (Mon-Sun) */}
              <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} className="py-2">{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthGrid.map((d, idx) => {
                  const key = ymd(d);
                  const isBooked = bookedDatesSet.has(key);
                  const isToday = sameDay(d, new Date());
                  const muted = !isCurrentMonth(d);

                  return (
                    <div
                      key={idx}
                      className={[
                        "relative h-20 rounded-xl border text-sm transition-all",
                        muted
                          ? "bg-gray-50 border-gray-100 text-gray-400"
                          : "bg-white border-gray-200",
                        isBooked && !muted
                          ? "outline outline-2 outline-blue-500/40 bg-blue-50"
                          : "",
                        "hover:shadow-sm"
                      ].join(" ")}
                      title={isBooked ? "Booked" : "Available"}
                    >
                      <div className="absolute top-2 right-2 text-xs font-semibold">
                        <span className={isToday ? "px-2 py-0.5 rounded-full bg-indigo-600 text-white" : ""}>
                          {d.getDate()}
                        </span>
                      </div>

                      {/* booked dot */}
                      {isBooked && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
                  <span className="text-gray-600">Has booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-indigo-600 text-white text-xs">Today</span>
                  <span className="text-gray-600">Current day</span>
                </div>
              </div>
            </div>

            {/* Month bookings list (1 col) */}
            <div className="lg:border-l p-4 max-h-[28rem] overflow-y-auto">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Bookings this month</h3>
              {loading && <p className="text-gray-600">Loading…</p>}
              {error && <p className="text-red-600">{error}</p>}
              {!loading && !error && monthBookings.length === 0 && (
                <p className="text-gray-600">No bookings intersect this month.</p>
              )}
              <ul className="space-y-2">
                {monthBookings.map((b, i) => (
                  <li key={b._id || i} className="p-3 rounded-xl border bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-800">{b?.name || "Customer"}</div>
                      <span className={[
                        "text-xs px-2 py-0.5 rounded-full",
                        b.status === 'confirmed' ? "bg-green-100 text-green-700" :
                        b.status === 'cancelled' ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      ].join(" ")}>
                        {b.status || 'pending'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    </div>
                    {b.car?.model && (
                      <div className="text-xs text-gray-500 mt-1">
                        Car: {b.car.model} {b.car.carId ? `(${b.car.carId})` : ""}
                      </div>
                    )}
                    {typeof b.totalAmount === 'number' && (
                      <div className="text-xs text-gray-500 mt-1">
                        Total: Rs. {b.totalAmount}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={() => setViewDate(new Date())}
              className="px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-200/60"
            >
              Today
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ---------- Main Header ---------- */
function AdminHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch admin data from original source
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    axios.get(`${API_BASE_URL}/api/admin/me`, {
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
    { path: "/admin-dashboard", label: "Fleet", icon: Car },
    { path: "/Admin-Booking", label: "Add Bookings", icon: Book },
    { path: "/user-detail", label: "Users", icon: Users },
    { path: "/All-bookings", label: "Bookings", icon: Book },
    { path: "/User-Rewiews", label: "Reviews", icon: Star },
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
              {/* NEW: Calendar button */}
              <button
                onClick={() => setCalendarOpen(true)}
                title="View bookings calendar"
                className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                  scrolled
                    ? "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
                    : "text-blue-100 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                }`}
              >
                <CalendarDays />
              </button>

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
                {[
                  ...[
                    { path: "/admin-dashboard", label: "Fleet", icon: Car },
                    { path: "/Admin-Booking", label: "Add Bookings", icon: Book },
                    { path: "/user-detail", label: "Users", icon: Users },
                    { path: "/All-bookings", label: "Bookings", icon: Book },
                    { path: "/User-Rewiews", label: "Reviews", icon: Star },
                    
                    
                  ]
                ].map((item) => {
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

      {/* Calendar Modal */}
      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        token={localStorage.getItem('adminToken')}
      />
    </>
  );
}

export default AdminHeader;
