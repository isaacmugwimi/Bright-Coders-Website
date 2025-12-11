import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import DashboardLayout from "./Layout/DashboardLayout";
import Navbar from "./Layout/Navbar";
import Footer from "./Components/Footer";
import About from "./Pages/About";
import Programs from "./Pages/Programs";
import Register from "./Pages/Register";
import Contact from "./Pages/Contact";
import Founder from "./Components/Founder";
import ScrollToTop from "./helper/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./helper/PageWrapper";
import FAQs from "./Components/FAQs";
import Blog from "./Pages/BlogPage";
// import React from "react";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="popLayout">
      <Routes location={location} key={location.pathname}>
        {/* Default redirect from / to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Dashboard/Home route */}
        <Route
          path="/home"
          element={
            <PageWrapper>
              <DashboardLayout />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <About />
            </PageWrapper>
          }
        />
        <Route
          path="/programs"
          element={
            <PageWrapper>
              <Programs />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper>
              <Contact />
            </PageWrapper>
          }
        />

        <Route
          path="/faqs"
          element={
            <PageWrapper>
              <FAQs />
            </PageWrapper>
          }
        />
        <Route
          path="/blogs"
          element={
            <PageWrapper>
              <Blog/>
            </PageWrapper>
          }
        />

        <Route
          path="/founder"
          element={
            <PageWrapper>
              <Founder />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      {/* Only the page transitions are animated */}
      <AnimatedRoutes />

      <Footer />
    </Router>
  );
}

export default App;
