const express = require("express");
const router = express.Router();
const FacultyReview = require("../models/facultyReviewModel");
const { requireAuth } = require("../middleware/authMiddleware"); // ✅ added

// Create a new faculty review
router.post("/", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit faculty reviews" });
    }
    const review = new FacultyReview({
      ...req.body,
      user: req.user._id
    });
    
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating faculty review:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get all faculty reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await FacultyReview.find().populate("faculty user");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews for a specific faculty
router.get("/faculty/:facultyId", async (req, res) => {
  try {
    const reviews = await FacultyReview.find({ faculty: req.params.facultyId })
      .populate("user", "name email")
      .populate("faculty", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 Get all faculty reviews by a specific user (secured)
router.get("/user/:id/reviews", requireAuth, async (req, res) => {
  const userId = req.params.id;
  try {
    const reviews = await FacultyReview.find({ user: userId })
      .populate("faculty")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to load faculty reviews." });
  }
});

// Update a faculty review (owner only)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id.toString();
    const { rating, comment, anonymous } = req.body;

    const review = await FacultyReview.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Faculty review not found" });

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (anonymous !== undefined) review.anonymous = !!anonymous;

    await review.save();
    const updated = await FacultyReview.findById(reviewId).populate("faculty user");
    res.json(updated);
  } catch (error) {
    console.error("Error updating faculty review:", error);
    res.status(500).json({ message: "Failed to update faculty review" });
  }
});

// Delete a faculty review (owner only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id.toString();

    const review = await FacultyReview.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Faculty review not found" });

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await FacultyReview.findByIdAndDelete(reviewId);
    res.json({ message: "Faculty review deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty review:", error);
    res.status(500).json({ message: "Failed to delete faculty review" });
  }
});

module.exports = router;
// Upvote toggle for faculty reviews
router.post("/upvote/:id", requireAuth, async (req, res) => {
  try {
    const review = await FacultyReview.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    const userId = req.user._id.toString();
    const hasUpvoted = review.upvotedBy.map((x) => x.toString()).includes(userId);
    if (hasUpvoted) {
      review.upvotedBy = review.upvotedBy.filter((x) => x.toString() !== userId);
    } else {
      review.upvotedBy.push(userId);
    }
    await review.save();
    const updated = await FacultyReview.findById(review._id);
    res.json({ upvotes: updated.upvotes, upvotedBy: updated.upvotedBy });
  } catch (error) {
    console.error("Error toggling faculty upvote:", error);
    res.status(500).json({ message: "Failed to toggle upvote" });
  }
});

// Report toggle for faculty reviews
router.post("/report/:id", requireAuth, async (req, res) => {
  try {
    const review = await FacultyReview.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    const userId = req.user._id.toString();
    const hasReported = review.reports.map((x) => x.toString()).includes(userId);
    if (hasReported) {
      review.reports = review.reports.filter((x) => x.toString() !== userId);
      await review.save();
      return res.json({ message: "Report removed", reports: review.reports });
    } else {
      review.reports.push(userId);
      await review.save();
      return res.json({ message: "Reported", reports: review.reports });
    }
  } catch (error) {
    console.error("Error toggling faculty report:", error);
    res.status(500).json({ message: "Failed to toggle report" });
  }
});
