const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const Review = require("../models/Review");

// Get my reviews
router.get("/me/reviews", requireAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("course", "code name")
      .populate("faculty", "name")
      .sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch your reviews" });
  }
});

// Delete user account
router.delete("/me", requireAuth, async (req, res) => {
  try {
    const User = require("../models/User");
    const FacultyReview = require("../models/facultyReviewModel");
    const userId = req.user._id;

    // Delete all user's reviews (both course and faculty)
    await Review.deleteMany({ user: userId });
    await FacultyReview.deleteMany({ user: userId });
    
    // Delete the user account
    await User.findByIdAndDelete(userId);

    return res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete account" });
  }
});

module.exports = router;
