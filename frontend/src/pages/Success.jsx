import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Calendar, Mail } from 'lucide-react';

const SuccessPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className={`max-w-2xl w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Success Icon with Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30">
                <Check className="w-16 h-16 text-white animate-bounce" strokeWidth={3} />
              </div>
              <div className="absolute -top-2 -right-2 animate-spin-slow">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight">
                Booking Confirmed!
              </h1>
              
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-lg font-medium">Your reservation is secured</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>

              <p className="text-xl text-gray-200 leading-relaxed max-w-md mx-auto">
                Thank you for choosing us! We're excited to provide you with an exceptional experience.
              </p>

              {/* Action Button */}
              <div className="flex justify-center pt-8">
                <a 
                  href="/my-booking"
                  className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>View Details</span>
                </a>
              </div>

              {/* Additional Info */}
              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-center space-x-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Confirmation email sent to your inbox</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Wave Animation */}
          <div className="mt-12 text-center">
            <div className="inline-flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SuccessPage;