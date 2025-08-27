import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, ArrowRight } from "lucide-react";

const UserFooter = () => {
  return (
    <footer
      role="contentinfo"
      className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="hidden sm:block absolute top-20 left-10 w-56 h-56 sm:w-72 sm:h-72 bg-blue-400 rounded-full blur-3xl animate-pulse motion-reduce:animate-none" />
        <div className="hidden md:block absolute bottom-20 right-10 w-72 h-72 md:w-96 md:h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse motion-reduce:animate-none delay-1000" />
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 lg:w-64 lg:h-64 bg-cyan-400 rounded-full blur-3xl animate-pulse motion-reduce:animate-none delay-500" />
      </div>

      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-10 lg:mb-12">
          {/* About */}
          <section className="lg:col-span-6 group">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10 transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:ring-1 hover:ring-white/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
                About Us
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping motion-reduce:animate-none" />
              </h3>
              <p className="text-gray-300 leading-relaxed text-justify sm:text-left">
                Welcome to <span className="font-semibold">ISGA Enterprise Pvt Ltd</span>, your trusted partner in car rental services.
                Based in the heart of Nuwara Eliya, we specialize in offering a wide range of vehicles to cater to all your travel needs.
                With years of experience in the industry, we take pride in providing top-notch service. At <span className="font-semibold">ISGA ENTERPRISE</span>,
                customer satisfaction is our top priority. Whether you need a car for a few hours, a day, or an extended period, our flexible rental plans are designed to suit your schedule and budget.
              </p>
            </div>
          </section>

          {/* Quick Links */}
          <nav aria-label="Quick links" className="lg:col-span-3 group">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10 transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:ring-1 hover:ring-white/20 h-full">
              <h3 className="text-lg sm:text-xl font-bold mb-5 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/user-home" className="flex items-center gap-2 text-gray-300 hover:text-cyan-300">
                    <ArrowRight className="w-4 h-4 opacity-70" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/user-dashboard" className="flex items-center gap-2 text-gray-300 hover:text-cyan-300">
                    <ArrowRight className="w-4 h-4 opacity-70" />
                    Car Listing
                  </Link>
                </li>
                <li>
                  <Link to="/my-booking" className="flex items-center gap-2 text-gray-300 hover:text-cyan-300">
                    <ArrowRight className="w-4 h-4 opacity-70" />
                    Booking
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Contact */}
          <section aria-label="Head office" className="lg:col-span-3 group">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10 transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:ring-1 hover:ring-white/20 h-full">
              <h3 className="text-lg sm:text-xl font-bold mb-5 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Head Office
              </h3>
              <div className="space-y-5">
                <a
                  href="https://maps.app.goo.gl/CkrQhGsameiGocuZA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-cyan-300"
                >
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Nuwara Eliya, Sri Lanka</span>
                </a>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium">Contact Numbers:</span>
                  </div>
                  <div className="ml-8 space-y-2">
                    <a href="tel:+94777800060" className="block text-gray-300 hover:text-cyan-300 text-sm">0777800060</a>
                    <a href="tel:+94706668666" className="block text-gray-300 hover:text-cyan-300 text-sm">0706300000</a>
                  </div>
                </div>

                <a href="mailto:Isgaholdings@gmail.com" className="flex items-center gap-3 text-gray-300 hover:text-cyan-300">
                  <Mail className="w-5 h-5 text-red-400" />
                  <span className="text-sm">Isgaholdings@gmail.com</span>
                </a>

                <div className="flex items-start gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div className="text-sm leading-relaxed">
                    <div className="font-medium">Business Hours</div>
                    <div className="text-gray-400">Monday to Saturday</div>
                    <div className="text-gray-400">8:00 AM – 8:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Social */}
        <section aria-label="Social links" className="text-center mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Follow Us
          </h3>
          <div className="flex justify-center">
            <a
              href="https://www.facebook.com/Isgaholdings?mibextid=LQQJ4d"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-2 rounded-full shadow-lg hover:shadow-blue-500/40 transition-transform duration-200 hover:-translate-y-0.5">
                <Facebook className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -inset-0.5 rounded-full blur-sm opacity-0 hover:opacity-40 transition-opacity bg-gradient-to-r from-blue-600 to-cyan-600" />
            </a>
          </div>
        </section>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-6 lg:pt-8">
          <div className="text-center">
            <div className="inline-block backdrop-blur-sm bg-white/5 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 border border-white/10">
              <p className="text-gray-300 text-sm sm:text-base">
                &copy; {new Date().getFullYear()}
                <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mx-2">
                  ISGA ENTERPRISE PVT LTD
                </span>
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tiny dots */}
      <div className="hidden md:block absolute top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping motion-reduce:animate-none delay-300" />
      <div className="hidden lg:block absolute bottom-20 left-20 w-1 h-1 bg-blue-400 rounded-full animate-ping motion-reduce:animate-none delay-700" />
      <div className="hidden xl:block absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping motion-reduce:animate-none delay-1000" />
    </footer>
  );
};

export default UserFooter;
