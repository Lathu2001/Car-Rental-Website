// routes/review.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Mongoose model

router.post("/", async (req, res) => {
  try {
    console.log("Incoming review:", req.body);  // <-- Add this

    const { userId, userName, rating, reviewText } = req.body;

    const newReview = new Review({ userId, userName, rating, reviewText });
    await newReview.save();

    res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    console.error("Error while submitting review:", error);  // <-- Add this
    res.status(500).json({ message: "Failed to submit review.", error });
  }
});
// GET - Fetch all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews.", error });
  }
});

// DELETE - Delete a review by ID
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review.", error });
  }
});
module.exports = router;
