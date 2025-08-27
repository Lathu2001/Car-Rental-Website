// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Link } from "react-router-dom";
import API_BASE_URL from '../config/api';
import { 
  CarIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  MapPinIcon, 
  StarIcon,
  UserIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircleIcon,
  ArrowRightIcon,
  TruckIcon,
  ClockIcon
} from 'lucide-react';

// Image imports
import car1 from '../assets/Images/car1.jpg';
import car2 from '../assets/Images/car2.jpg';
import car3 from '../assets/Images/car3.jpg';
import car4 from '../assets/Images/car4.jpg';
import car5 from '../assets/Images/car5.jpg';
import car6 from '../assets/Images/car6.jpg';
import wedding1 from '../assets/Images/wedding1.jpg';
import wedding2 from '../assets/Images/wedding2.jpg';
import wedding3 from '../assets/Images/wedding3.jpg';

/* ---------- Simple toast (non-blocking) ---------- */
function Toast({ type = 'info', message, onClose }) {
  if (!message) return null;
  const style =
    type === 'success'
      ? 'bg-green-600/90'
      : type === 'error'
      ? 'bg-red-600/90'
      : 'bg-slate-800/90';

  return (
    <div role="status" aria-live="polite" className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] px-4">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white ${style}`}>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white text-xs underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ---------- Custom arrow components ---------- */
function NextArrow(props) {
  const { className, onClick } = props;
  return (
    <button
      type="button"
      className={`${className} hover:scale-110 transition-transform duration-300 !flex !items-center !justify-center`}
      onClick={onClick}
      aria-label="Next"
    >
      <ChevronRight className="text-blue-600 w-6 h-6 drop-shadow-lg" />
    </button>
  );
}
function PrevArrow(props) {
  const { className, onClick } = props;
  return (
    <button
      type="button"
      className={`${className} hover:scale-110 transition-transform duration-300 !flex !items-center !justify-center`}
      onClick={onClick}
      aria-label="Previous"
    >
      <ChevronLeft className="text-blue-600 w-6 h-6 drop-shadow-lg" />
    </button>
  );
}

/* ---------- Slider settings ---------- */
const reviewSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  adaptiveHeight: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  pauseOnDotsHover: true,
  touchThreshold: 12,
  swipeToSlide: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
  ],
};

const singleSliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  adaptiveHeight: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  pauseOnDotsHover: true,
  touchThreshold: 12,
  swipeToSlide: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 640, settings: { arrows: false } }
  ]
};

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [toast, setToast] = useState({ type: 'info', message: '' });

  // Read user from sessionStorage first (matches your login), then fallback
  const [user, setUser] = useState(() => ({
    userId: sessionStorage.getItem("userId") || localStorage.getItem("userId") || "",
    userName: sessionStorage.getItem("username") || localStorage.getItem("username") || ""
  }));

  // Slider refs for visibility pause/resume
  const availRef = useRef(null);
  const weddingRef = useRef(null);
  const reviewsRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.08 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/review`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Pause/resume sliders when tab visibility changes
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        availRef.current?.slickPause?.();
        weddingRef.current?.slickPause?.();
        reviewsRef.current?.slickPause?.();
      } else {
        availRef.current?.slickPlay?.();
        weddingRef.current?.slickPlay?.();
        reviewsRef.current?.slickPlay?.();
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const showToast = (message, type = 'info', duration = 1800) => {
    setToast({ message, type });
    const t = setTimeout(() => setToast({ message: '', type }), duration);
    return () => clearTimeout(t);
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewText) {
      showToast("Please provide both rating and review text.", "info");
      return;
    }
    if (!user.userId) {
      showToast("Please login to submit a review.", "error", 2200);
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/review`, {
        userId: user.userId,
        userName: user.userName,
        rating,
        reviewText
      });
      setSubmitSuccess(true);
      setRating(0);
      setReviewText("");
      showToast("Thank you! Review submitted.", "success");
      // Refresh reviews
      const response = await axios.get(`${API_BASE_URL}/api/review`);
      setReviews(response.data);
      setTimeout(() => setSubmitSuccess(false), 2200);
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Could not submit review. Try again.", "error", 2200);
    }
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ message: '', type: toast.type })}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        {/* Animated background elements (subtle) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 grid md:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            <div className="inline-block">
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase animate-bounce-subtle">
                Premium Car Rental
              </span>
            </div>

            <h1 className="font-extrabold leading-tight text-gray-900 font-serif text-4xl sm:text-5xl lg:text-6xl">
              <span className="block animate-slide-in-left">Drive Your</span>
              <span className="block text-blue-600 animate-slide-in-right" style={{animationDelay: '0.2s'}}>Dreams</span>
              <span className="block animate-slide-in-left" style={{animationDelay: '0.4s'}}>with Excellence</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed font-serif animate-fade-in" style={{animationDelay: '0.6s'}}>
              Experience unparalleled comfort, reliability, and luxury in every journey.
              Your perfect ride awaits.
            </p>

            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4" style={{animationDelay: '0.8s'}}>
              <Link to="/login" className="animate-fade-in">
                <button className="group relative overflow-hidden font-serif px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Book Your Ride Now
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>
              </Link>

              <Link to="/car" className="animate-fade-in">
                <button className="font-serif px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                  View Fleet
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6 animate-fade-in-up" style={{animationDelay: '1s'}}>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">500+</div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">50+</div>
                <div className="text-xs sm:text-sm text-gray-600">Premium Cars</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-right" style={{animationDelay: '0.5s'}}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
              <img
                src={car6}
                alt="ISGA Enterprise Premium Car"
                loading="lazy"
                className="relative w-full rounded-2xl shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-3 sm:p-4 rounded-xl shadow-lg animate-bounce-subtle">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  <span className="text-xs sm:text-sm font-semibold">Verified Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        id="services" 
        data-animate
        className={`py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 ${isVisible.services ? 'animate-fade-in-up' : 'opacity-0 translate-y-20'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Our Premium Services</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover why thousands choose us for their transportation needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
            {[
              { bg: 'bg-blue-100', icon: CarIcon, title: 'Wide Range', desc: 'From compact cars to luxury sedans, find your perfect match', hover: 'group-hover:bg-blue-600', txt: 'text-blue-600' },
              { bg: 'bg-green-100', icon: CalendarIcon, title: 'Flexible Bookings', desc: 'Easy online booking system with instant confirmation', hover: 'group-hover:bg-green-600', txt: 'text-green-600' },
              { bg: 'bg-purple-100', icon: ShieldCheckIcon, title: 'Safety First', desc: 'Regularly serviced vehicles with comprehensive insurance', hover: 'group-hover:bg-purple-600', txt: 'text-purple-600' },
              { bg: 'bg-orange-100', icon: ClockIcon, title: '24/7 Support', desc: 'Round-the-clock customer service and roadside assistance', hover: 'group-hover:bg-orange-600', txt: 'text-orange-600' },
            ].map(({ bg, icon: Icon, title, desc, hover, txt }) => (
              <div
                key={title}
                className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 h-full"
              >
                <div className="flex flex-col min-h-[230px]">
                  <div className="relative mb-5">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 ${bg} rounded-2xl flex items-center justify-center ${hover} transition-colors duration-300`}>
                      <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${txt} group-hover:text-white transition-colors duration-300`} />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-4 h-4 ${txt.replace('text', 'bg')} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping`}></div>
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3 group-hover:${txt.replace('text-', '')} transition-colors duration-300`}>
                    {title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section 
        id="cars" 
        data-animate
        className={`py-14 sm:py-16 lg:py-20 bg-white transition-all duration-1000 ${isVisible.cars ? 'animate-fade-in-up' : 'opacity-0 translate-y-20'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Available Cars */}
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Available Cars</h2>
                <p className="text-gray-600 text-sm sm:text-base">Discover our premium collection</p>
              </div>

              <div className="relative">
                <Slider ref={availRef} {...singleSliderSettings} className="max-w-xl mx-auto car-slider">
                  {[car1, car2, car3, car4, car5].map((img, i) => (
                    <div key={i} className="px-2">
                      <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                        <div className="relative overflow-hidden">
                          <img
                            src={img}
                            alt={`Luxury Car ${i + 1}`}
                            loading="lazy"
                            className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                            <span className="bg-blue-600 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold">Available Now</span>
                          </div>
                        </div>
                        <div className="p-5 sm:p-6">
                          <h3 className="text-xl sm:text-2xl font-bold mb-1.5 group-hover:text-blue-600 transition-colors duration-300">
                            Premium Sedan
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base">Perfect for business and leisure travel</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            {/* Wedding Cars */}
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Wedding Cars</h2>
                <p className="text-gray-600 text-sm sm:text-base">Elegant rides for your special day</p>
              </div>

              <div className="relative">
                <Slider ref={weddingRef} {...singleSliderSettings} className="max-w-xl mx-auto wedding-slider">
                  {[wedding1, wedding2, wedding3].map((img, i) => (
                    <div key={i} className="px-2">
                      <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                        <div className="relative overflow-hidden">
                          <img
                            src={img}
                            alt={`Wedding Car ${i + 1}`}
                            loading="lazy"
                            className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                            <span className="bg-pink-600 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold">Wedding Special</span>
                          </div>
                        </div>
                        <div className="p-5 sm:p-6">
                          <h3 className="text-xl sm:text-2xl font-bold mb-1.5 group-hover:text-pink-600 transition-colors duration-300">
                            Wedding Special
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base">Make your wedding day unforgettable</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section 
        id="reviews" 
        data-animate
        className={`py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 ${isVisible.reviews ? 'animate-fade-in-up' : 'opacity-0 translate-y-20'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">Real experiences from real customers</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 sm:ml-4 text-gray-600 text-sm sm:text-base">Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <StarIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="relative">
              <Slider ref={reviewsRef} {...reviewSettings} className="px-2 sm:px-4 reviews-slider">
                {reviews.map((review) => (
                  <div key={review._id} className="px-2">
                    <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 h-full">
                      <div className="flex mb-4 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${i < review.rating ? "text-yellow-500 scale-110" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 text-base sm:text-lg italic mb-6 leading-relaxed">
                        "{review.reviewText}"
                      </blockquote>
                      <div className="flex items-center justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-blue-600 transition-colors duration-300">
                          <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {review.userName}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">Verified Customer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </section>

      {/* Review Form Section */}
      <section 
        id="review-form" 
        data-animate
        className={`py-14 sm:py-16 lg:py-20 bg-white transition-all duration-1000 ${isVisible['review-form'] ? 'animate-fade-in-up' : 'opacity-0 translate-y-20'}`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border border-gray-100">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Share Your Experience</h3>
                <p className="text-gray-600 text-sm sm:text-lg">Help others by sharing your journey with us</p>
              </div>

              {submitSuccess && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-center transform animate-bounce-in">
                  <CheckCircleIcon className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 mx-auto mb-1.5 sm:mb-2" />
                  <p className="text-green-700 font-semibold text-sm sm:text-lg">
                    Thank you! Your review has been submitted successfully.
                  </p>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-6 sm:space-y-8">
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-sm sm:text-lg font-semibold text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={user.userName}
                    onChange={(e) => setUser({ ...user, userName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-sm sm:text-lg"
                    required
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-sm sm:text-lg font-semibold text-gray-700">
                    Your Rating
                  </label>
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-3xl sm:text-4xl cursor-pointer transition-all duration-300 transform hover:scale-125 ${
                          star <= rating ? "text-yellow-500 drop-shadow-lg" : "text-gray-300 hover:text-yellow-300"
                        }`}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-xs sm:text-sm text-gray-500">
                    {rating === 0 && "Click to rate"}
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-sm sm:text-lg font-semibold text-gray-700">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={5}
                    placeholder="Share your experience with our service..."
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-sm sm:text-lg resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="group relative w-full py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base sm:text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Submit Your Review
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        /* Slick spacing */
        .slick-slide > div { margin: 0 10px; }
        .slick-list { margin: 0 -10px; }

        /* Arrows */
        .slick-prev, .slick-next {
          width: 50px; height: 50px; z-index: 2; border-radius: 50%;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
        }
        .slick-prev { left: -60px; }
        .slick-next { right: -60px; }
        .slick-prev:hover, .slick-next:hover { background: rgba(255,255,255,1); transform: scale(1.1); }

        /* Dots */
        .slick-dots { bottom: -36px; }
        .slick-dots li { margin: 0 8px; }
        .slick-dots li button:before {
          font-size: 12px; color: #cbd5e1; opacity: 1; transition: all .3s ease;
        }
        .slick-dots li.slick-active button:before { color: #2563eb; transform: scale(1.25); }
        .slick-dots li:hover button:before { color: #3b82f6; transform: scale(1.15); }

        /* Keyframes */
        @keyframes fade-in-up { from {opacity:0; transform:translateY(30px);} to {opacity:1; transform:translateY(0);} }
        @keyframes fade-in { from {opacity:0;} to {opacity:1;} }
        @keyframes slide-in-left { from {opacity:0; transform:translateX(-50px);} to {opacity:1; transform:translateX(0);} }
        @keyframes slide-in-right { from {opacity:0; transform:translateX(50px);} to {opacity:1; transform:translateX(0);} }
        @keyframes fade-in-right { from {opacity:0; transform:translateX(50px);} to {opacity:1; transform:translateX(0);} }
        @keyframes bounce-subtle { 0%,100% {transform:translateY(0);} 50% {transform:translateY(-8px);} }
        @keyframes bounce-in { 0% {opacity:0; transform:scale(.3);} 50% {transform:scale(1.05);} 70% {transform:scale(.9);} 100% {opacity:1; transform:scale(1);} }

        .animate-fade-in-up { animation: fade-in-up .8s ease-out forwards; }
        .animate-fade-in { animation: fade-in .8s ease-out forwards; }
        .animate-slide-in-left { animation: slide-in-left .8s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right .8s ease-out forwards; }
        .animate-fade-in-right { animation: fade-in-right .8s ease-out forwards; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .animate-bounce-in { animation: bounce-in .6s ease-out forwards; }

        /* Mobile tweaks for arrows */
        @media (max-width: 768px) {
          .slick-prev { left: -30px; }
          .slick-next { right: -30px; }
          .slick-prev, .slick-next { width: 40px; height: 40px; }
        }
        @media (max-width: 640px) {
          .slick-prev, .slick-next { display: none !important; }
          .slick-dots { bottom: -30px; }
        }

        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up, .animate-fade-in, .animate-slide-in-left, .animate-slide-in-right, .animate-fade-in-right, .animate-bounce-subtle, .animate-bounce-in {
            animation: none !important;
          }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(135deg, #5a67d8 0%, #667eea 100%); }

        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
