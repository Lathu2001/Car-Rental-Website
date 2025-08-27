import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api";
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
  XCircle,
} from "lucide-react";
import logo from "../../assets/Images/logo1.jpg";

/** ---------- Small helpers ---------- */
const BOOKINGS_API = `${API_BASE_URL}/api/bookings`;

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
const ymd = (d) => d.toISOString().slice(0, 10);
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function buildMonthGrid(viewDate) {
  const first = startOfMonth(viewDate);
  const last = endOfMonth(viewDate);
  const weekday = (w) => (w === 0 ? 7 : w); // Monday = 1
  const leading = weekday(first.getDay()) - 1;
  const trailing = 7 - weekday(last.getDay());
  const gridStart = addDays(first, -leading);
  const total = leading + last.getDate() + (trailing === 7 ? 0 : trailing);
  const days = [];
  for (let i = 0; i < total; i++) days.push(addDays(gridStart, i));
  return days;
}

/** ---------- Calendar Modal ---------- */
function CalendarModal({ open, onClose, token }) {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [viewDate, setViewDate] = useState(() => new Date());

  useEffect(() => {
    if (!open) return;
    let ignore = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(BOOKINGS_API, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!ignore) setBookings(res.data || []);
      } catch (e) {
        if (!ignore) setError("Failed to load bookings.");
        console.error("Calendar bookings fetch error:", e?.response || e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [open, token]);

  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const bookedDatesSet = useMemo(() => {
    const set = new Set();
    bookings.forEach((b) => {
      if (!b.startDate || !b.endDate) return;
      const s = new Date(b.startDate);
      const e = new Date(b.endDate);
      for (let d = new Date(s); d <= e; d = addDays(d, 1)) set.add(ymd(d));
    });
    return set;
  }, [bookings]);

  const monthBookings = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    return bookings.filter((b) => {
      const s = new Date(b.startDate);
      const e = new Date(b.endDate);
      return s <= end && e >= start;
    });
  }, [bookings, viewDate]);

  const isCurrentMonth = (d) => d.getMonth() === viewDate.getMonth();
  const gotoPrev = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const gotoNext = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

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
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-blue-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Bookings Calendar</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-200/60 text-gray-600">
              <XCircle />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4">
            {/* Calendar left */}
            <div className="lg:col-span-2 p-3 sm:p-4">
              {/* Month controls */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={gotoPrev}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-700"
                  aria-label="Previous month"
                >
                  <ChevronLeft />
                </button>
                <div className="text-base sm:text-lg font-bold text-gray-800">
                  {viewDate.toLocaleString(undefined, { month: "long", year: "numeric" })}
                </div>
                <button
                  onClick={gotoNext}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-700"
                  aria-label="Next month"
                >
                  <ChevronRight />
                </button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-gray-500 mb-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="py-2">
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid */}
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
                        "relative h-16 sm:h-20 rounded-xl border text-sm transition-all",
                        muted ? "bg-gray-50 border-gray-100 text-gray-400" : "bg-white border-gray-200",
                        isBooked && !muted ? "outline outline-2 outline-blue-500/40 bg-blue-50" : "",
                        "hover:shadow-sm",
                      ].join(" ")}
                      title={isBooked ? "Booked" : "Available"}
                    >
                      <div className="absolute top-2 right-2 text-xs font-semibold">
                        <span className={isToday ? "px-2 py-0.5 rounded-full bg-indigo-600 text-white" : ""}>
                          {d.getDate()}
                        </span>
                      </div>
                      {isBooked && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-2 h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-xs sm:text-sm">
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

            {/* Month bookings list */}
            <div className="lg:border-l p-3 sm:p-4 max-h-[28rem] overflow-y-auto">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Bookings this month</h3>
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
                      <span
                        className={[
                          "text-xs px-2 py-0.5 rounded-full",
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700",
                        ].join(" ")}
                      >
                        {b.status || "pending"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(b.startDate).toLocaleDateString()} –{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </div>
                    {b.car?.model && (
                      <div className="text-xs text-gray-500 mt-1">
                        Car: {b.car.model} {b.car.carId ? `(${b.car.carId})` : ""}
                      </div>
                    )}
                    {typeof b.totalAmount === "number" && (
                      <div className="text-xs text-gray-500 mt-1">Total: Rs. {b.totalAmount}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-4 sm:px-6 py-4 border-t bg-gray-50">
            <button
              onClick={() => setViewDate(new Date())}
              className="px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-200/60"
            >
              Today
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Fetch admin data
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    axios
      .get(`${API_BASE_URL}/api/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setAdmin(res.data))
      .catch((err) => {
        console.error("❌ Error fetching admin:", err);
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      });
  }, [navigate]);

  // Scroll style
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
    { path: "/admin-dashboard", label: "Fleet", icon: Car },
    { path: "/Admin-Booking", label: "Add Bookings", icon: Book },
    { path: "/user-detail", label: "Users", icon: Users },
    { path: "/All-bookings", label: "Bookings", icon: Book },
    { path: "/User-Rewiews", label: "Reviews", icon: Star },
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
            <Link to="/admin-dashboard" className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={logo}
                  alt="ISGA Admin Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 mr-1 sm:mr-2 rounded-lg transition-transform duration-300 hover:scale-105"
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
                <p
                  className={`text-xs sm:text-base lg:text-lg font-medium truncate ${
                    scrolled ? "text-gray-500" : "text-blue-200"
                  }`}
                >
                  Admin Portal
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
              {/* Calendar button */}
              <button
                onClick={() => setCalendarOpen(true)}
                title="View bookings calendar"
                className={`p-2 sm:p-3 rounded-xl transition-colors ${
                  scrolled ? "text-gray-700 hover:text-blue-700 hover:bg-gray-100" : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <CalendarDays />
              </button>

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
                            {admin?.name || "Admin User"}
                          </p>
                          <p className="text-sm sm:text-base text-gray-600 truncate">
                            {admin?.email || "admin@isga.com"}
                          </p>
                          <span className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Online
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50"
                      >
                        <User size={18} className="text-gray-500" />
                        <span className="text-sm sm:text-base">Account Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to sign out?")) {
                            localStorage.removeItem("adminToken");
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
                aria-controls="admin-mobile-menu"
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
        id="admin-mobile-menu"
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
            <span className="font-semibold text-gray-800">Admin Menu</span>
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

      {/* Calendar Modal */}
      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        token={localStorage.getItem("adminToken")}
      />
    </>
  );
}

export default AdminHeader;
