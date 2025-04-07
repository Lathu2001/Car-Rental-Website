import React, { useEffect, useState } from "react";
import axios from "axios";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/review");
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">User Reviews</h2>

      <div className="mb-4">
        <label className="font-semibold mr-2">Filter by Rating:</label>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="border rounded p-1"
        >
          <option value="all">All</option>
          {[5, 4, 3, 2, 1].map((rate) => (
            <option key={rate} value={rate}>{rate} Stars</option>
          ))}
        </select>
      </div>

      {filteredReviews.length === 0 ? (
        <p>No reviews submitted yet.</p>
      ) : (
        filteredReviews.map((review) => (
          <div key={review._id} className="bg-white shadow-md p-4 rounded mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{review.userName}</p>
                <p className="text-yellow-500 text-lg">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </p>
                <p className="text-gray-700 mt-2">{review.reviewText}</p>
              </div>
              <button
                onClick={() => handleDelete(review._id)}
                className="text-red-600 font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserReviews;
