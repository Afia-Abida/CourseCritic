import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import CourseSearch from "./pages/CourseSearch";
import SubmitReview from "./pages/SubmitReview";
import SubmitFacultyReview from "./pages/SubmitFacultyReview";
import UserSubmittedReviews from "./pages/UserSubmittedReviews";
import FacultySearch from "./pages/FacultySearch";
import FacultyPage from "./pages/FacultyPage";
import CoursePage from "./pages/CoursePage";
import EditProfile from "./pages/EditProfile";
import AdminStudents from "./pages/AdminStudents";
import AdminFaculties from "./pages/AdminFaculties";
import AdminReportedCourseReviews from "./pages/AdminReportedCourseReviews";
import AdminReportedFacultyReviews from "./pages/AdminReportedFacultyReviews";

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
              <UserSubmittedReviews />
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
        <Route
          path="/faculties"
          element={
            <PrivateRoute>
              <FacultySearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/faculty/:facultyId"
          element={
            <PrivateRoute>
              <FacultyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <PrivateRoute>
              <AdminStudents />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/faculties"
          element={
            <PrivateRoute>
              <AdminFaculties />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reported-course-reviews"
          element={
            <PrivateRoute>
              <AdminReportedCourseReviews />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reported-faculty-reviews"
          element={
            <PrivateRoute>
              <AdminReportedFacultyReviews />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;



