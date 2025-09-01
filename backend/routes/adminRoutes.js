const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Review = require("../models/Review");
const FacultyReview = require("../models/facultyReviewModel");

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Get all students
router.get("/students", requireAuth, requireAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// Get all faculty
router.get("/faculties", requireAuth, requireAdmin, async (req, res) => {
  try {
    const faculties = await User.find({ role: "faculty" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(faculties);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).json({ message: "Failed to fetch faculties" });
  }
});

// Delete user account (admin only)
router.delete("/users/:userId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete all user's reviews (both course and faculty)
    const deletedCourseReviews = await Review.deleteMany({ user: userId });
    const deletedFacultyReviews = await FacultyReview.deleteMany({ user: userId });
    console.log(`Admin deleted ${deletedCourseReviews.deletedCount} course reviews and ${deletedFacultyReviews.deletedCount} faculty reviews for user ${userId}`);
    
    // Delete the user account
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user account" });
  }
});

// Get reported course reviews
router.get("/reported-course-reviews", requireAuth, requireAdmin, async (req, res) => {
  try {
    const reportedReviews = await Review.find({ 
      reports: { $exists: true, $not: { $size: 0 } } 
    })
      .populate("user", "name email")
      .populate("course", "code name")
      .sort({ createdAt: -1 });

    res.json(reportedReviews);
  } catch (error) {
    console.error("Error fetching reported course reviews:", error);
    res.status(500).json({ message: "Failed to fetch reported reviews" });
  }
});

// Get reported faculty reviews
router.get("/reported-faculty-reviews", requireAuth, requireAdmin, async (req, res) => {
  try {
    const reportedReviews = await FacultyReview.find({ 
      reports: { $exists: true, $not: { $size: 0 } } 
    })
      .populate("user", "name email")
      .populate("faculty", "name")
      .sort({ createdAt: -1 });

    res.json(reportedReviews);
  } catch (error) {
    console.error("Error fetching reported faculty reviews:", error);
    res.status(500).json({ message: "Failed to fetch reported reviews" });
  }
});

// Delete course review (admin only)
router.delete("/course-reviews/:reviewId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Course review deleted successfully" });
  } catch (error) {
    console.error("Error deleting course review:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

// Delete faculty review (admin only)
router.delete("/faculty-reviews/:reviewId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const deletedReview = await FacultyReview.findByIdAndDelete(reviewId);
    
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Faculty review deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty review:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

module.exports = router;
