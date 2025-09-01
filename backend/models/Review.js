const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    ratingDifficulty: { type: Number, min: 1, max: 5, required: true },
    ratingWorkload: { type: Number, min: 1, max: 5, required: true },
    ratingUsefulness: { type: Number, min: 1, max: 5, required: true },

    comment: { type: String },

    anonymous: { type: Boolean, default: false },

    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],

    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],

    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", default: null },
    facultyRating: { type: Number, min: 1, max: 5, default: null },
  },
  { timestamps: true }
);

ReviewSchema.virtual("upvotes").get(function () {
  return (this.upvotedBy && this.upvotedBy.length) || 0;
});
ReviewSchema.set("toJSON", { virtuals: true });
ReviewSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Review", ReviewSchema);
