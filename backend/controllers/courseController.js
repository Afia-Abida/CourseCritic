const Course = require("../models/Course");
const Review = require("../models/Review");

// GET course with reviews
const getCourseWithReviews = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reviews = await Review.find({ course: req.params.id });

    res.json({ course, reviews });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCourseWithReviews };
