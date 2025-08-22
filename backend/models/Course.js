const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
