import React, { useEffect, useState } from "react";
import axios from "axios";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/review");
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`http://localhost:5000/api/review/${id}`);
        fetchReviews(); // Refresh reviews
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const filteredReviews = filterRating === "all"
    ? reviews
    : reviews.filter((review) => review.rating === Number(filterRating));

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const ratingCounts = getRatingCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 py-8 relative overflow-hidden">
      {/* Professional animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Moving gradient orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300/25 rounded-full blur-3xl" style={{
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl" style={{
          animation: 'float 10s ease-in-out infinite reverse'
        }}></div>
        <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-cyan-300/25 rounded-full blur-3xl" style={{
          animation: 'drift 12s linear infinite'
        }}></div>
        
        {/* Moving geometric shapes */}
        <div className="absolute top-20 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-lg blur-sm rotate-45" style={{
          animation: 'rotate-slow 20s linear infinite'
        }}></div>
        <div className="absolute bottom-32 left-1/5 w-24 h-24 bg-gradient-to-r from-indigo-200/20 to-cyan-200/20 rounded-full blur-sm" style={{
          animation: 'bounce-slow 8s ease-in-out infinite'
        }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-32 left-1/4 w-3 h-3 bg-blue-400 rounded-full" style={{
            animation: 'float-up 15s linear infinite'
          }}></div>
          <div className="absolute top-64 right-1/4 w-2 h-2 bg-purple-400 rounded-full" style={{
            animation: 'float-up 18s linear infinite 3s'
          }}></div>
          <div className="absolute bottom-48 left-1/3 w-4 h-4 bg-indigo-400 rounded-full" style={{
            animation: 'float-up 12s linear infinite 6s'
          }}></div>
          <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-cyan-400 rounded-full" style={{
            animation: 'float-up 20s linear infinite 9s'
          }}></div>
          <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-pink-400 rounded-full" style={{
            animation: 'float-diagonal 16s linear infinite'
          }}></div>
          <div className="absolute top-1/3 right-1/6 w-2 h-2 bg-violet-400 rounded-full" style={{
            animation: 'float-diagonal 14s linear infinite 4s'
          }}></div>
        </div>
        
        {/* Animated wave pattern */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z" fill="url(#waveGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;-200,0;0,0"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-15px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        
        @keyframes drift {
          0% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(50px) translateY(-30px); }
          50% { transform: translateX(-30px) translateY(-60px); }
          75% { transform: translateX(40px) translateY(-20px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        
        @keyframes rotate-slow {
          from { transform: rotate(45deg); }
          to { transform: rotate(405deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-40px) scale(1.1); }
        }
        
        @keyframes float-up {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
        }
        
        @keyframes float-diagonal {
          0% { transform: translate(100vw, 100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(-100px, -100px); opacity: 0; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm">Customer Reviews</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            See what our customers have to say about their car rental experience
          </p>
        </div>

        {/* Statistics Section */}
        {reviews.length > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 mb-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{getAverageRating()}</div>
                <div className="text-yellow-400 text-2xl mb-2">
                  {"★".repeat(Math.floor(getAverageRating()))}
                  {getAverageRating() % 1 !== 0 && "⭐"}
                  {"☆".repeat(5 - Math.ceil(getAverageRating()))}
                </div>
                <p className="text-gray-600">Average Rating</p>
                <p className="text-sm text-gray-500">Based on {reviews.length} reviews</p>
              </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center mb-2">
                    <span className="text-sm text-gray-600 w-8">{rating}★</span>
                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: reviews.length > 0 ? `${(ratingCounts[rating] / reviews.length) * 100}%` : '0%'
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{ratingCounts[rating]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
              All Reviews ({filteredReviews.length})
            </h2>
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Filter by rating:</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="all">All Ratings</option>
                {[5, 4, 3, 2, 1].map((rate) => (
                  <option key={rate} value={rate}>{rate} Stars</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-12 text-center border border-white/20">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Found</h3>
              <p className="text-gray-600">
                {filterRating === "all" 
                  ? "No reviews have been submitted yet." 
                  : `No ${filterRating}-star reviews found.`}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review._id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 hover:bg-white/98">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* User Info */}
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                          <span className="text-white font-semibold text-lg">
                            {review.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="text-yellow-400 text-xl mr-2">
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">({review.rating}/5)</span>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                      title="Delete Review"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {filteredReviews.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-700">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviews;