import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import {
  CarFront,
  Search,
  X,
  AlertTriangle,
  Loader2,
  Users,
  Tag,
  Fuel,
  CalendarRange,
  ArrowRight,
} from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(amount || 0);

const fallBackImg =
  "https://via.placeholder.com/800x500.png?text=Car+Image+Unavailable";

export default function UserDashboard() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");

  // Fetch cars
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setFetchError("");
        const res = await fetch(`${API_BASE_URL}/api/cars`, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = json?.data || json || [];
        if (mounted) setCars(Array.isArray(list) ? list : []);
      } catch (e) {
        if (mounted) {
          console.error("Error fetching cars:", e);
          setFetchError(
            "We couldn’t load cars right now. Please try again in a moment."
          );
          setCars([]);
        }
      } finally {
        mounted && setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Filtered list (model or carId)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cars;
    return cars.filter(
      (c) =>
        `${c?.model || ""}`.toLowerCase().includes(q) ||
        `${c?.carId || ""}`.toLowerCase().includes(q)
    );
  }, [cars, search]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium">Loading cars…</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center border border-slate-100">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">
            Failed to Load Cars
          </h3>
          <p className="text-sm text-slate-600 mb-4">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-200 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <header className="text-center pt-10 pb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 shadow-md mb-3">
            <CarFront className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Available Cars
          </h1>
          <p className="text-slate-600 mt-1">
            Search and pick your ride to book instantly
          </p>
        </header>

        {/* Search */}
        <section className="max-w-2xl mx-auto w-full">
          <label className="sr-only" htmlFor="car-search">
            Search cars
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="car-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model or registration number…"
              className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {search && (
            <p
              className="text-xs text-slate-500 mt-2 text-center"
              aria-live="polite"
            >
              Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}{" "}
              for “{search}”
            </p>
          )}
        </section>

        {/* Grid */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-slate-800">
                {search ? "No cars match your search" : "No cars available"}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {search
                  ? "Try a different model name or registration number."
                  : "Please check back later."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filtered.map((car) => (
              <article
                key={car?._id || car?.carId}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                  <img
                    src={car?.imageUrl || car?.image || fallBackImg}
                    alt={car?.model ? `${car.model}` : "Car image"}
                    onError={(e) => {
                      e.currentTarget.src = fallBackImg;
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  {/* Price badge */}
                  <div className="absolute bottom-3 left-3 rounded-xl bg-white/90 backdrop-blur px-3 py-2 border border-white shadow-sm">
                    <div className="text-indigo-700 font-semibold leading-tight">
                      {formatCurrency(car?.rentPerDay)}
                    </div>
                    <div className="text-[11px] text-slate-500 -mt-0.5">
                      per day
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {car?.model || "Unknown Model"}
                  </h3>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-2">
                      <Tag className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">
                        {car?.carId || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-2">
                      <Users className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-slate-700 font-medium">
                        {car?.passengerCount || 0} seats
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-2">
                      <Fuel className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-slate-700 font-medium">
                        {car?.fuelCostPerKm
                          ? `${car.fuelCostPerKm} km/l`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-2">
                      <CalendarRange className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-slate-700 font-medium truncate">
                        {formatCurrency(car?.longPeriodRentPerDay)}/30+
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/book-car/${car?.carId}`}
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-2.5 px-4 hover:from-indigo-700 hover:to-violet-700 transition"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
