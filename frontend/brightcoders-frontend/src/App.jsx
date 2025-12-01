import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./Layout/DashboardLayout";
import About from "./Components/About";
import Programs from "./Components/Programs";
import Register from "./Pages/Register";
import Contact from "./Pages/Contact";
import Founder from "./Components/Founder";
import ScrollToTop from "./helper/ScrollToTop";

function App() {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <Routes>
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
      </Router>
    </div>
  );
}

export default App;
