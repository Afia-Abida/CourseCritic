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

module.exports = router;
