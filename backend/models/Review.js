// backend/models/Review.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    // Course metrics 
    ratingDifficulty: { type: Number, min: 1, max: 5, required: true },
    ratingWorkload: { type: Number, min: 1, max: 5, required: true },
    ratingUsefulness: { type: Number, min: 1, max: 5, required: true },

    // Text
    comment: { type: String },

    // Anonymous flag
    anonymous: { type: Boolean, default: false },

    // Upvotes
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],

    // Reporting
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],

    // Faculty rating (optional)
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", default: null },
    facultyRating: { type: Number, min: 1, max: 5, default: null },
  },
  { timestamps: true }
);

// virtual count to keep frontend compatibility with `review.upvotes`
ReviewSchema.virtual("upvotes").get(function () {
  return (this.upvotedBy && this.upvotedBy.length) || 0;
});
ReviewSchema.set("toJSON", { virtuals: true });
ReviewSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Review", ReviewSchema);
