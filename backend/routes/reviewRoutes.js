const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Review = require("../models/Review");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { course, ratingDifficulty, ratingWorkload, ratingUsefulness, comment } = req.body;
    if (!course || !ratingDifficulty || !ratingWorkload || !ratingUsefulness) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReview = new Review({
      user: new mongoose.Types.ObjectId(decoded.id || decoded._id || decoded.userId),
      course: new mongoose.Types.ObjectId(course),
      ratingDifficulty,
      ratingWorkload,
      ratingUsefulness,
      comment,
    });

    await newReview.save();

    return res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Server error:", error.message, error.stack);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

