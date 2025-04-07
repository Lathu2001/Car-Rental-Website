import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/Images/logo.png';

function Header() {
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
                  to="/" 
                  className="text-white hover:text-yellow-300 hover:underline text-lg font-medium px-4 py-2 transition-all duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/Car" 
                  className="text-white hover:text-yellow-300 hover:underline text-lg font-medium px-4 py-2 transition-all duration-300"
                >
                  Cars
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-white hover:text-yellow-300 hover:underline text-lg font-medium px-4 py-2 transition-all duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-white hover:text-yellow-300 hover:underline text-lg font-medium px-4 py-2 transition-all duration-300"
                >
                  About Us
                </Link>
              </li>
              <li className="flex space-x-4 mt-2 md:mt-0">
              <Link 
                  to="/login" 
                  className="bg-white text-blue-900 text-lg font-semibold px-5 py-2 rounded-md border border-white hover:border-blue-500 hover:bg-white hover:text-blue-500 transition-all duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-900 text-lg font-semibold px-5 py-2 rounded-md border border-white hover:border-blue-500 hover:bg-white hover:text-blue-500 transition-all duration-300"
                >
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;