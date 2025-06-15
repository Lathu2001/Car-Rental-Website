import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* About Us Section */}
          <div className="lg:col-span-2 group">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
                About Us
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              </h3>
              <p className="text-gray-300 leading-relaxed text-justify hover:text-white transition-colors duration-300">
                Welcome to ISGA Holdings Pvt Ltd, your trusted partner in car rental services.
                Based in the heart of Nuwara Eliya, we specialize in offering a wide range of vehicles to cater to all your travel needs. With years of experience in the industry, we take pride in providing top-notch service.
                At ISGA ENTERPRISE, customer satisfaction is our top priority. Whether you need a car for a few hours, a day, or an extended period, our flexible rental plans are designed to suit your schedule and budget.
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="group">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full">
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Quick Links
              </h3>
              <div className="space-y-3">
                <a 
                  href="/about" 
                  className="flex items-center gap-2 text-gray-300 hover:text-cyan-300 transition-all duration-300 group-hover:translate-x-2"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  About
                </a>
                <a 
                  href="/cars" 
                  className="flex items-center gap-2 text-gray-300 hover:text-cyan-300 transition-all duration-300 group-hover:translate-x-2"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Car Listing
                </a>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="group">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full">
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Head Office
              </h3>
              <div className="space-y-5">
                <a 
                  href='https://maps.app.goo.gl/CkrQhGsameiGocuZA' 
                  className="flex items-center gap-3 text-gray-300 hover:text-cyan-300 transition-all duration-300 hover:translate-x-1"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Nuwara Eliya, Sri Lanka</span>
                </a>
                
                {/* Phone Numbers Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium">Contact Numbers:</span>
                  </div>
                  <div className="ml-8 space-y-2">
                    <a 
                      href="tel:+94777800060" 
                      className="block text-gray-300 hover:text-cyan-300 transition-all duration-300 hover:translate-x-1 text-sm"
                    >
                      +94-777-800060
                    </a>
                    <a 
                      href="tel:+94706668666" 
                      className="block text-gray-300 hover:text-cyan-300 transition-all duration-300 hover:translate-x-1 text-sm"
                    >
                      +94-706-668666
                    </a>
                  </div>
                </div>
                
                <a 
                  href="mailto:Isgaholdings@gmail.com" 
                  className="flex items-center gap-3 text-gray-300 hover:text-cyan-300 transition-all duration-300 hover:translate-x-1"
                >
                  <Mail className="w-5 h-5 text-red-400" />
                  <span className="text-sm">Isgaholdings@gmail.com</span>
                </a>
                
                <div className="flex items-start gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">Business Hours:</div>
                    <div className="text-gray-400">Monday to Saturday</div>
                    <div className="text-gray-400">8:00 AM - 8:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Follow Us
          </h3>
          <div className="flex justify-center">
            <a 
              href="https://www.facebook.com/Isgaholdings?mibextid=LQQJ4d"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 hover:scale-110 hover:rotate-12">
                <Facebook className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 pt-8">
          <div className="text-center">
            <div className="inline-block backdrop-blur-sm bg-white/5 rounded-full px-6 py-3 border border-white/10">
              <p className="text-gray-300">
                &copy; {new Date().getFullYear()} 
                <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mx-2">
                  ISGA Holdings PVT LTD
                </span>
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-300"></div>
      <div className="absolute bottom-20 left-20 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-700"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping delay-1000"></div>
    </footer>
  );
};

export default Footer;