import React from "react";
import {
  FaBullseye,
  FaEye,
  FaSmile,
  FaLaptopCode,
  FaLightbulb,
  FaUserCheck,
} from "react-icons/fa";

import "../Css/AboutUs.css";
import { useNavigate } from "react-router-dom";
import about_image_1 from "../assets/about-image-1.webp";

import founder from "../assets/AirBrush_20250725153208.jpg";
import { motion } from "framer-motion";

const AboutUs = () => {
  const navigate = useNavigate();
  const handleEnrollBtn = (e) => {
    e.preventDefault();
    navigate("/register");
  };
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      {/* HERO SECTION */}
      <section className="about-hero ">
        <h1>About Bright Coders</h1>
        <p>Empowering young minds through creative and fun coding education.</p>
      </section>

      {/* WHO WE ARE */}
      <section className="who-we-are">
        <div className="who-text">
          <h2>Who We Are</h2>
          <p>
            Bright Coders is a children’s coding academy dedicated to helping
            young learners explore creativity, problem-solving, and digital
            skills. We offer beginner-friendly programming classes for ages
            5–14. Our goal is to build confidence, curiosity, and a strong
            foundation in technology through fun, hands-on learning.
          </p>
        </div>

        <div className="who-image">
          <img
            src="https://imgs.search.brave.com/-fZjMdjN_37wyOq_NmjnkEHycP7FhjRWd9RJ7HWdBPk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjIz/MDY1MDUwL3Bob3Rv/L2tpZHMtY29kaW5n/LWluLXNjaG9vbC5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/bGN3b055WWVnV3VU/U1RPb083NFJjSklG/SldfWDdtYnpiY0Zn/cGdnemFRST0"
            alt="Kids learning coding"
          />
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="mission-vision">
        <div className="mv-card">
          <FaBullseye className="mv-icon" />
          <h3>Our Mission</h3>
          <p>
            To inspire confidence, creativity and computational thinking in
            children through guided, hands-on coding experiences.
          </p>
        </div>

        <div className="mv-card">
          <FaEye className="mv-icon" />
          <h3>Our Vision</h3>
          <p>
            To become Africa’s leading coding school for young learners —
            nurturing creators, thinkers, and problem-solvers who shape the
            digital future.
          </p>
        </div>
      </section>

      {/* VALUE PROPOSITIONS */}
      <section className="values-section">
        <h2>What We Offer</h2>
        <div className="values-grid">
          <div className="value-card">
            <FaSmile className="value-icon" color="#F4C542" />
            <h4>Fun & Interactive</h4>
            <p>
              We make learning enjoyable through games and hands-on activities.
            </p>
          </div>

          <div className="value-card">
            <FaLaptopCode className="value-icon" color="#06B6D4" />
            <h4>Beginner-Friendly</h4>
            <p>No prior experience needed — we guide students step by step.</p>
          </div>

          <div className="value-card">
            <FaLightbulb className="value-icon" color="#FF8C42" />
            <h4>Project-Based</h4>
            <p>
              Students build real projects to strengthen creativity and skills.
            </p>
          </div>

          <div className="value-card">
            <FaUserCheck className="value-icon" color="#A43EE8" />
            <h4>Personalized Attention</h4>
            <p>Small class sizes ensure every child receives full support.</p>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="our-story">
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            Bright Coders began with a simple vision — to help kids learn
            technology in a fun and engaging way. What started with a small
            group of learners has grown into a thriving community of young
            innovators excited about coding, robotics, and digital creation.
          </p>
        </div>

        <div className="story-image">
          <img src={about_image_1} alt="Founder teaching kids" />
        </div>
      </section>

      {/* FOUNDER PREVIEW */}
      <section className="founder-preview">
        <div className="founder-img-section">
          {" "}
          <img src={founder} alt="Founder" className="founder-img" />
        </div>

        <div className="founder-info">
          <h2>Meet the Founder</h2>
          <p>
            Our founder is passionate about empowering young learners and
            unlocking their creativity through technology.
          </p>

          <button className="btn-read-more" onClick={()=>{
            navigate("/founder")
          }}>Read Full Story</button>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section">
        <h2>Ready to Enroll?</h2>
        <p>Give your child the chance to build real-world digital skills.</p>
        <button className="cta-btn" onClick={handleEnrollBtn}>
          Enroll Now
        </button>
      </section>

      {/* <div className="bottom-margin"></div> */}
    </motion.div>
  );
};

export default AboutUs;
