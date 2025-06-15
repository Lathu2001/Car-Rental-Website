import { useState } from "react";
import { User, Mail, MapPin, Home, Phone, CreditCard, Lock, Eye, EyeOff, Car, UserPlus } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    city: "",
    address: "",
    phoneNumber: "",
    NICNumber: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const navigate = {
    push: (path) => console.log(`Navigating to: ${path}`)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateField = (name, value) => {
    let error = "";

    // Email validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email address.";
      }
    }

    // Phone number validation
    if (name === "phoneNumber") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        error = "Phone number must be 10 digits.";
      }
    }

    // NIC number validation
    if (name === "NICNumber") {
      const nicRegex = /^(?:[0-9]{12}|[0-9]{9}[Vv])$/;
      if (!nicRegex.test(value)) {
        error = "NIC number must be 12 digits or 10 digits followed by 'V' or 'v'.";
      }
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFocusedField('');
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Final validation before submission
    const errors = Object.keys(formData).reduce((acc, field) => {
      validateField(field, formData[field]);
      if (formErrors[field]) acc[field] = formErrors[field];
      return acc;
    }, {});

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      alert(data.message || "Registration successful!");
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { name: "name", placeholder: "Full Name", type: "text", icon: User },
    { name: "username", placeholder: "Username", type: "text", icon: User },
    { name: "email", placeholder: "Email Address", type: "email", icon: Mail },
    { name: "city", placeholder: "City", type: "text", icon: MapPin },
    { name: "address", placeholder: "Address", type: "text", icon: Home },
    { name: "phoneNumber", placeholder: "Phone Number", type: "tel", icon: Phone },
    { name: "NICNumber", placeholder: "NIC Number", type: "text", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Multiple Car Background Images */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517994112540-009c8e9f9269?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`
          }}
        ></div>
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-black/30 to-purple-900/50"></div>
      
      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Floating Car Icons */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <Car
            key={i}
            size={20 + Math.random() * 30}
            className="absolute text-white opacity-10 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Registration Panel */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="relative">
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-[2px] opacity-60">
              <div className="bg-black/80 rounded-3xl h-full w-full"></div>
            </div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl mb-6 animate-bounce shadow-lg">
                  <UserPlus size={40} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Create Account
                </h1>
                <p className="text-gray-200 text-lg">Join our automotive community</p>
              </div>

              <div onSubmit={handleRegistration} className="space-y-5">
                {/* Dynamic Input Fields */}
                {inputFields.map(({ name, placeholder, type, icon: Icon }) => (
                  <div key={name} className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === name ? 'opacity-30' : ''}`}></div>
                    <div className="relative">
                      <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 z-10" size={20} />
                      <input
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        onFocus={() => setFocusedField(name)}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        type={type}
                        placeholder={placeholder}
                        required
                      />
                    </div>
                    {formErrors[name] && (
                      <div className="mt-2 text-red-400 text-sm font-medium animate-shake">
                        {formErrors[name]}
                      </div>
                    )}
                  </div>
                ))}

                {/* Password Field */}
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-30' : ''}`}></div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 z-10" size={20} />
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      onFocus={() => setFocusedField('password')}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <div className="mt-2 text-red-400 text-sm font-medium animate-shake">
                      {formErrors.password}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleRegistration}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-lg mt-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Register Now'
                    )}
                  </span>
                </button>

                {/* Admin Registration Link */}
                <div className="text-center pt-6 border-t border-white/20">
                  <p className="text-gray-200 mb-2">Need admin access?</p>
                  <button
                    type="button"
                    onClick={() => navigate.push('/admin-register')}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline decoration-blue-400 underline-offset-4 text-lg font-medium"
                  >
                    Register as Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}