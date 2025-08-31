const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { requireAuth } = require("../middleware/authMiddleware");

// CREATE review
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      course,
      ratingDifficulty,
      ratingWorkload,
      ratingUsefulness,
      comment,
      anonymous,
      faculty,        // optional
      facultyRating,  // optional
    } = req.body;

    if (!course || !ratingDifficulty || !ratingWorkload || !ratingUsefulness) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = req.user._id;
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit course reviews" });
    }

    const review = new Review({
      course,
      ratingDifficulty,
      ratingWorkload,
      ratingUsefulness,
      comment,
      anonymous: !!anonymous,
      user: userId,
      faculty: faculty || null,
      facultyRating: facultyRating || null,
    });

    await review.save();
    const populated = await review.populate("user", "name email");
    return res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to submit review" });
  }
});

// ✅ FIXED: now matches frontend request GET /api/reviews/user/:userId
router.get("/user/:userId", requireAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate("course", "code name")
      .populate("faculty", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch user reviews" });
  }
});

// GET reviews by course
router.get("/:courseId", async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate("user", "name email")
      .populate("faculty", "name")
      .sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// Upvote a review
router.post("/upvote/:id", requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user has already upvoted
    const hasUpvoted = review.upvotedBy.includes(userId);
    
    if (hasUpvoted) {
      // Remove upvote
      review.upvotedBy = review.upvotedBy.filter(id => id.toString() !== userId.toString());
    } else {
      // Add upvote
      review.upvotedBy.push(userId);
    }

    await review.save();
    
    // Return updated review with populated data
    const updatedReview = await Review.findById(reviewId)
      .populate("user", "name email")
      .populate("faculty", "name");
    
    res.json({
      upvotes: updatedReview.upvotedBy.length,
      upvotedBy: updatedReview.upvotedBy,
      hasUpvoted: !hasUpvoted
    });
  } catch (err) {
    console.error("Error toggling upvote:", err);
    res.status(500).json({ message: "Failed to toggle upvote" });
  }
});

// Report/Unreport a review (toggle functionality)
router.post("/report/:id", requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user has already reported
    const hasReported = review.reports.includes(userId);
    
    if (hasReported) {
      // Remove report
      review.reports = review.reports.filter(id => id.toString() !== userId.toString());
      await review.save();
      res.json({ 
        message: "Report removed successfully",
        reports: review.reports
      });
    } else {
      // Add report
      review.reports.push(userId);
      await review.save();
      res.json({ 
        message: "Review reported successfully",
        reports: review.reports
      });
    }
  } catch (err) {
    console.error("Error toggling report:", err);
    res.status(500).json({ message: "Failed to toggle report" });
  }
});

// Update a review
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;
    const { comment, ratingDifficulty, ratingWorkload, ratingUsefulness, anonymous } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    // Update fields
    if (comment !== undefined) review.comment = comment;
    if (ratingDifficulty !== undefined) review.ratingDifficulty = ratingDifficulty;
    if (ratingWorkload !== undefined) review.ratingWorkload = ratingWorkload;
    if (ratingUsefulness !== undefined) review.ratingUsefulness = ratingUsefulness;
    if (anonymous !== undefined) review.anonymous = !!anonymous;

    await review.save();
    
    const updatedReview = await Review.findById(reviewId)
      .populate("user", "name email")
      .populate("course", "code name")
      .populate("faculty", "name");
    
    res.json(updatedReview);
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ message: "Failed to update review" });
  }
});

// Delete a review
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

module.exports = router;


