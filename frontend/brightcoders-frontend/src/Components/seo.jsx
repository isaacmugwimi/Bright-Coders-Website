import React from "react";
import "../Css/Home.css";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import heroIllustration from "../assets/gemini2.png";
import NumberCounter from "number-counter";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // 1. Import Framer Motion

const Home = () => {
  const navigate = useNavigate();
  const [text] = useTypewriter({
    words: ["Future.", "Games.", "Ideas.", "Success.", "Magic."],
    loop: 0,
    typeSpeed: 80,
    deleteSpeed: 50,
    delaySpeed: 1500,
  });

  // Animation Variants for staggering the text entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="hero-wrapper">
      <div className="hero-container">
        {/* Left Content */}
        <motion.div
          className="hero-text-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="hero-badge">
            <span>🚀</span> Master the Art of Shipping Code
          </motion.div>

          <motion.div variants={itemVariants} className="wavy-text">
            <h1>Bright Coders</h1>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-main-title">
            Build the <span className="text-highlight">{text}</span>
            <span className="cursor-style">
              <Cursor cursorStyle="✏️" />
            </span>
            <br />
            One Line at a Time.
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-description">
            Fun, friendly coding classes for Grades 1–3, 4–6 & 7–9. No prior
            experience required.
          </motion.p>

          <motion.div variants={itemVariants} className="hero-action-btns">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-get-started"
              onClick={() => navigate("/register")}
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-view-courses"
              onClick={() => navigate("/programs")}
            >
              View Courses
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-mini-stats">
            <div className="stat-box">
              <h3>
                <NumberCounter postFix="+" start={10} delay={2} end={90} />
              </h3>
              <p>Students</p>
            </div>
            <div className="stat-box">
              <h3>
                <NumberCounter postFix="+" start={10} delay={2} end={50} />
              </h3>
              <p>Expert Mentors</p>
            </div>
            <div className="stat-box">
              <h3>
                <NumberCounter postFix="+" start={10} delay={2} end={75} />
              </h3>
              <p>Certificates Issued</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Image with Floating Animation */}
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, x: 50 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -20, 0], // Floating effect
          }}
          transition={{
            x: { duration: 0.8 },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.8 },
          }}
        >
          <img src={heroIllustration} alt="Bright Coders Illustration" />
        </motion.div>
      </div>

      {/* Scroll Indicator with fade-in */}

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <p>Scroll Down</p>
      </motion.div>
    </div>
  );
};

export default Home;
