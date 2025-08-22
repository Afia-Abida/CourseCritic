import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import CourseSearch from "./pages/CourseSearch";
import SubmitReview from "./pages/SubmitReview";
import SubmitFacultyReview from "./pages/SubmitFacultyReview"; // new
import UserDashboard from "./pages/UserDashboard"; // new
import CoursePage from "./pages/CoursePage";

// Protect routes that need login
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected routes */}
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <CourseSearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/submit-review"
          element={
            <PrivateRoute>
              <SubmitReview />
            </PrivateRoute>
          }
        />
        <Route
          path="/submit-faculty-review"
          element={
            <PrivateRoute>
              <SubmitFacultyReview />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <PrivateRoute>
              <CoursePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;



