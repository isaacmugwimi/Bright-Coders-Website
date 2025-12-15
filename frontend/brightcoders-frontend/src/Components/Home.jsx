import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import hero_banner2 from "../assets/Education_design_img.png";
import hero_footer from "../assets/Group65.png";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { FaArrowRight } from "react-icons/fa";
import "../Css/Home.css";

/* =======================
   Mobile Slider Images
======================= */
const mobileImages = [
  "https://imgs.search.brave.com/oWvu_zBGZluKc_2Xbm3q-fDUgnFG_OXq5_rHTogIZk8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDkv/NzUxLzI4My9zbWFs/bC9jb2Rpbmctc2Ny/aXB0LXRleHQtb24t/c2NyZWVuLWNvZGUt/aW4tYnJhY2tldC1z/b2Z0d2FyZS1waG90/by5qcGc",
  "https://imgs.search.brave.com/UiWu-MK7_fZpT-OeS1mNfeQcxiYhgK5ehe_l6Q8yQgQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE3/MTE3MTg2NC9waG90/by9oaXNwYW5pYy1s/YXRpbi1hbWVyaWNh/bi1zb2Z0d2FyZS1l/bmdpbmVlci1kZXZl/bG9wZXItdXNlLWxh/cHRvcC1jb21wdXRl/ci1wcm9ncmFtLWNv/ZGluZy5qcGc",
];

/* =======================
   Framer Motion Variants
======================= */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.35,
      delayChildren: 0.3,
    },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: -80 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9 } },
};

const slideRight = {
  hidden: { opacity: 0, x: 80 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9 } },
};

/* =======================
   Home Component
======================= */
const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [text] = useTypewriter({
    words: ["Imagine", "Solve Problems", "Code", "Play", "Explore Tech"],
    loop: 0,
    typeSpeed: 80,
    deleteSpeed: 50,
    delaySpeed: 1500,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mobileImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEnroll = () => navigate("/register");

  return (
    <motion.div className="home-section">
      {/* ================= HERO LEFT ================= */}
      <motion.div
        className="hero-left"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Headline */}
        <motion.div className="hero-headline" variants={slideLeft}>
          <div className="wavy-text">
            <h1>Bright Coders</h1>
          </div>

          <div className="hero-paragraph-2">
            <span className="text">Where Young Minds</span>
            <div className="animated-words-container">
              <span className="text animated">Learn to </span>
              <span className="text animated second-word gradient-text">
                {text}
              </span>
              <span className="cursor-style">
                <Cursor cursorStyle="/" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div className="hero-headline2" variants={slideRight}>
          <p>
            Fun, friendly coding classes for Grades 1–3, 4–6 & 7–9. No prior
            experience required.
          </p>
        </motion.div>

        {/* Button */}
        <motion.button
          className="enroll-button"
          onClick={handleEnroll}
          variants={scaleIn}
          whileHover={{ scale: 1.05 }}
        >
          <span>Enroll Now</span>
          <FaArrowRight className="arrow-icon" />
        </motion.button>

        {/* Mobile Carousel */}
        <motion.div className="mobile-img-carousel" variants={slideUp}>
          <AnimatePresence>
            <motion.img
              key={currentIndex}
              src={mobileImages[currentIndex]}
              alt="Mobile Banner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ================= HERO RIGHT ================ */}
      <motion.div

        className="hero-right hero"
        initial={{ opacity: 0, x: 120 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="img-container">
          <motion.img
            src="https://imgs.search.brave.com/oKfLFlCk0xqeKGnnBZSYcZICFtTvNjIyipopFvPnAT8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjIy/MzQ0Nzc3Ny9waG90/by9zbWFydC1ib3kt/Y29kaW5nLWF0LWhv/bWUtb24taGlzLWNv/bXB1dGVyLndlYnA_/YT0xJmI9MSZzPTYx/Mng2MTImdz0wJms9/MjAmYz16UEd5VFN4/R1RaTjFfSHBMc2l6/SzJEV0pzUEFjQmpE/anN4bndKOVpBRHpv/PQ"
            alt="Hero"
            className="image-holder one"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          />
          <img src={hero_banner2} className="banner" alt="" />
        </div>
      </motion.div>

      {/* ================= FOOTER ================= */}
      <div className="home_footer">
        <img src={hero_footer} alt="" className="home_footer_img" />
      </div>
    </motion.div>
  );
};

export default Home;
