// backend/models/facultyReviewModel.js
const mongoose = require("mongoose");

const facultyReviewSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: false,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

// Virtual upvotes count for compatibility
facultyReviewSchema.virtual("upvotes").get(function () {
  return (this.upvotedBy && this.upvotedBy.length) || 0;
});
facultyReviewSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("FacultyReview", facultyReviewSchema);
