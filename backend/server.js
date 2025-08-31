const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));       
app.use("/api/courses", require("./routes/courseRoutes"));  
app.use("/api/reviews", require("./routes/reviewRoutes"));  
app.use("/api/faculty", require("./routes/faculty"));                 // Faculties
app.use("/api/faculty-reviews", require("./routes/facultyReviewRoutes")); // Faculty Reviews
app.use("/api/users", require("./routes/userRoutes"));                  // User reviews
app.use("/api/admin", require("./routes/adminRoutes"));                 // Admin routes

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("DB connection error:", err));
