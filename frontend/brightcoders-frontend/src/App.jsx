import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
// import React from "react";

function App() {
  return (
    <div>
      <Router>
        <AnimatePresence mode="wait">
          <Navbar />
          <Routes location={location} key={location.pathname}>
            {/* Default redirect from / to /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Dashboard/Home route */}
            <Route path="/home" element={<DashboardLayout />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/founder" element={<Founder />} />
          </Routes>
          <Footer/>
        </AnimatePresence>
      </Router>
    </div>
  );
}

export default App;
