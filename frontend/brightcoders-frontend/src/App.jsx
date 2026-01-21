import React from "react";
import { HelmetProvider } from "react-helmet-async";
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
import CertificateVerify from "./Components/CertificateVerify/CertificateVerify";

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
      {/* 1. This handles clicking "Verify" from the Navbar (Search Mode) */}
      <Route path="/verify" element={<CertificateVerify />} />

      {/* 2. This handles the QR Code scan (Direct Verification Mode) */}
      <Route path="/verify/:regNumber" element={<CertificateVerify />} />
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      {" "}
      <Router>
        <ScrollToTop />
        <Navbar />

        {/* Main content wrapper ensures proper scroll */}
        <div className="main-content">
          <AppRoutes />
        </div>

        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
