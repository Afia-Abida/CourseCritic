const express = require("express");
const router = express.Router();
const FacultyReview = require("../models/facultyReviewModel");
const { requireAuth } = require("../middleware/authMiddleware"); // ✅ added

// Create a new faculty review
router.post("/", requireAuth, async (req, res) => {
  try {
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

// 🔥 Get all faculty reviews by a specific user (secured)
router.get("/user/:id/reviews", requireAuth, async (req, res) => {
  const userId = req.params.id;
  try {
    const reviews = await FacultyReview.find({ user: userId }).populate("faculty");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to load faculty reviews." });
  }
});

module.exports = router;
