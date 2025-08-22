const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  initials: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String }
});

// Use the exact collection name
module.exports = mongoose.model("Faculty", FacultySchema, "faculties");
