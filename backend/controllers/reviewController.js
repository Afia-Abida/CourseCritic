// backend/controllers/reviewController.js
const Review = require("../models/Review");
const Course = require("../models/Course");

// Get all reviews for a specific course
const getReviewsByCourse = async (req, res) => {
  try {
    const courseId = req.query.course;
    if (!courseId) return res.status(400).json({ message: "Course ID is required" });

    // Populate user's name for non-anonymous reviews
    const reviews = await Review.find({ course: courseId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    const { course, userName, ratingDifficulty, ratingWorkload, ratingUsefulness, comment, anonymous } = req.body;

    if (!course || !userName || !ratingDifficulty || !ratingWorkload || !ratingUsefulness)
      return res.status(400).json({ message: "All required fields must be filled" });

    const newReview = await Review.create({
      course,
      userName,          // store user name instead of user reference
      ratingDifficulty,
      ratingWorkload,
      ratingUsefulness,
      comment,
      anonymous,
      upvotes: 0,
      upvotedBy: [],
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upvote a review
const upvoteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { userId } = req.body; // pass userId from frontend

    if (!userId) return res.status(400).json({ message: "User ID is required to upvote" });

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.upvotedBy.includes(userId))
      return res.status(400).json({ message: "You can upvote only once" });

    review.upvotes += 1;
    review.upvotedBy.push(userId);
    await review.save();

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getReviewsByCourse,
  createReview,
  upvoteReview,
};
