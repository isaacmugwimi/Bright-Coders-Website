import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import hero_banner1 from "../assets/banner2.avif";
import hero_banner2 from "../assets/hero-banner-2.jpg";
import hero_shape_2 from "../assets/hero-shape-2.png";
// import hero_shape_2 from "../assets/banner2.avif";

import { FaArrowRight } from "react-icons/fa";

import "../Css/Home.css";
const Home = () => {
  const navigate = useNavigate();
  const [word, setWord] = useState("Code");
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const words = ["Imagine", "Solve Problems", "Code", "Play", "Explore Tech"];
    let index = 0;

    const interval = setInterval(() => {
      setWord(words[index]);
      index = (index + 1) % words.length;
    }, 4000);

    setIsVisible(true);

    return () => clearInterval(interval);
  }, []);

  // function to handle enroll button
  const handle_enroll_btn = (e) => {
    e.target.preventDefault;
    navigate("/register");
  };

  return (
    <motion.div
      className="home-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="hero-left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="hero-headline">
          <div className="wavy-text">
            <h1>Bright Coders</h1>
          </div>
          <div className="hero-paragraph-2">
            <span className="text">Where Young Minds</span>
            <div className="animated-words-container">
              <span className="text animated first-word">Learn to </span>
              <span className="text animated second-word">{word}</span>
            </div>
          </div>
        </div>
        <div className="hero-headline2">
          <p>
            Fun, friendly coding classes for Grades 1–3, 4–6 & 7–9. No prior
            experience required.
          </p>
        </div>
        <button className="enroll-button" onClick={handle_enroll_btn}>
          Enroll Now <FaArrowRight className="arrow-icon" />
        </button>
      </motion.div>
      <motion.div
        className="hero-right"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <img className="hero-shape" src={hero_shape_2} alt="" />
        <div className="">
          <img
            src={hero_banner1}
            alt="Hero Banner"
            className="image-holder one"
          />

          <img
            src={hero_banner2}
            alt="Hero Banner"
            className={isVisible ? "fade-in image-holder two" : "fade-out"}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
