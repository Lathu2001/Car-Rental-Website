import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Link } from "react-router-dom";
import { 
  CarIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  MapPinIcon, 
  StarIcon,
  UserIcon,
  ChevronLeft,
  ChevronRight
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

// Custom arrow components
function NextArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <ChevronRight className="text-blue-600 w-6 h-6" />
    </div>
  );
}

function PrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <ChevronLeft className="text-blue-600 w-6 h-6" />
    </div>
  );
}

// Slider settings
const reviewSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
};

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const user = {
    userId: localStorage.getItem("userId") || "",
    userName: localStorage.getItem("username") || ""
  };

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/review");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewText) {
      alert("Please provide both rating and review text");
      return;
    }
    if (!user.userId) {
      alert("Please login to submit a review");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/review", {
        userId: user.userId,
        userName: user.userName,
        rating,
        reviewText
      });
      setSubmitSuccess(true);
      setRating(0);
      setReviewText("");
      // Refresh reviews
      const response = await axios.get("http://localhost:5000/api/review");
      setReviews(response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };



  return (
    <div className="bg-white min-h-screen">
    {/* Hero Section - Updated with white background */}
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 font-serif">
            Drive Your Dreams with Exceptional Vehicles
          </h1>
          <p className="text-xl text-gray-600 mb-16 font-serif">
            Discover comfort, reliability, and luxury in every journey.
          </p>
          <Link to="/user-dashboard">
            <button className="font-serif px-8 py-2.5 bg-blue-600 text-white font-bold rounded-full 
              hover:bg-blue-700 mt-8 transition duration-300 transform hover:scale-105 shadow-lg">
              Book Your Ride Now
            </button>
          </Link>
        </div>
        <div className="hidden md:block">
          <img 
            src={car6} 
            alt="ISGA Holdings" 
            className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition duration-300"
          />
        </div>
      </div>
    </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <CarIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Wide Range</h3>
              <p>From compact cars to luxury sedans</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <CalendarIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Flexible Bookings</h3>
              <p>Easy online booking</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <ShieldCheckIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Safety First</h3>
              <p>Regularly serviced vehicles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-center mb-8">Available Cars</h2>
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={2500}
                className="max-w-xl mx-auto"
              >
                {[car1, car2, car3, car4, car5].map((img, i) => (
                  <div key={i} className="px-2">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <img src={img} alt={`Car ${i+1}`} className="w-full h-96 object-cover rounded-lg" />
                      <div className="mt-4 text-center">
                        <h3 className="text-xl font-semibold">Luxury Sedan</h3>
                        <p className="text-gray-600">Perfect for business and leisure</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-center mb-8">Wedding Cars</h2>
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={2500}
                className="max-w-xl mx-auto"
              >
                {[wedding1, wedding2, wedding3].map((img, i) => (
                  <div key={i} className="px-2">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <img src={img} alt={`Wedding Car ${i+1}`} className="w-full h-96 object-cover rounded-lg" />
                      <div className="mt-4 text-center">
                        <h3 className="text-xl font-semibold">Wedding Special</h3>
                        <p className="text-gray-600">Elegant rides for your special day</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Slider Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          {loading ? (
            <p className="text-center">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center">No reviews yet</p>
          ) : (
            <div className="relative">
              <Slider {...reviewSettings} className="px-4">
                {reviews.map((review) => (
                  <div key={review._id} className="px-2">
                    <div className="bg-white p-6 rounded-lg shadow-md h-full border border-gray-100">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`w-5 h-5 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                      <p className="italic mb-4">"{review.reviewText}"</p>
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                        <p className="font-semibold">{review.userName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </section>

            {/* Review Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg border-2 border-gray-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] transition-all duration-300">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800 border-b-2 border-gray-100 pb-4">
              Share Your Experience
            </h3>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-100 border-2 border-green-200 rounded-lg text-center">
                <p className="text-green-700 font-semibold">
                  ✅ Thank you! Your review has been submitted successfully.
                </p>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="flex items-center space-x-4">
                <label className="text-lg font-medium text-gray-700 whitespace-nowrap">
                  Your Rating:
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl cursor-pointer transition-all duration-200 ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  Your Review:
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={5}
                  placeholder="Tell us about your experience..."
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 shadow-md ${
                  user.userId 
                    ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                    : "bg-gray-400 cursor-not-allowed text-gray-100"
                }`}
                disabled={!user.userId}
              >
                {user.userId ? "Submit Your Review" : "Please Login to Review"}
              </button>
            </form>
          </div>
        </div>
      </section>


      {/* Custom Slider CSS */}
      <style jsx>{`
        .slick-slide > div {
          margin: 0 10px;
        }
        .slick-list {
          margin: 0 -10px;
        }
        .slick-prev, .slick-next {
          width: 40px;
          height: 40px;
          z-index: 1;
        }
        .slick-prev {
          left: -45px;
        }
        .slick-next {
          right: -45px;
        }
        .slick-prev:hover, .slick-next:hover {
          color: #2563eb;
        }
        .slick-dots li button:before {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}