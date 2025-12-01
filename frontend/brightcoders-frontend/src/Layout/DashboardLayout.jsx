import React from "react";
import Navbar from "./Navbar";
import Home from "../Components/Home";
import FeaturedCourses from "../Components/FeaturedCourses";
import WhyChoseUs from "../Components/WhyChoseUs";
import HowItWorks from "../Components/HowItWorks";
import AboutHomepage from "../Components/AboutHomepage";
import Testimonials from "../Components/Testimonials";
import Footer from "../Components/Footer";

const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <Home />
      <FeaturedCourses />
      <WhyChoseUs />
      <HowItWorks />
      <AboutHomepage />
      <Testimonials />
      <Footer />
    </>
  );
};

export default DashboardLayout;
