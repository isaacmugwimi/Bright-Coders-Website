import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Layout/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./helper/ScrollToTop";
import DashboardLayout from "./Layout/DashboardLayout";
import About from "./Pages/About";
import Programs from "./Pages/Programs";
import Register from "./Pages/Register";
import Contact from "./Pages/Contact";
import Founder from "./Components/Founder";
import FAQs from "./Components/FAQs";
import Blog from "./Pages/BlogPage";
import CourseDetail from "./Components/CourseDetail";
import TestimonialPage from "./Components/Testimonials/TestimonialPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/home" element={<DashboardLayout />} />
      <Route path="/about" element={<About />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/course-detail" element={<CourseDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/founder" element={<Founder />} />
      <Route path="/testimonials" element={<TestimonialPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      {/* Main content wrapper ensures proper scroll */}
      <div className="main-content">
        <AppRoutes />
      </div>

      <Footer />
    </Router>
  );
}

export default App;
