const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");

// GET all faculties
router.get("/", async (req, res) => {
  try {
    const faculties = await Faculty.find({});
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
