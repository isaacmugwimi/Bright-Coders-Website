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
  const transition = { type: "easeIn", duration: 3 };
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
        <motion.button
          // initial={{ opacity: 0, x: 350 }}
          // animate={{ opacity: 1, x: 0 }}
          // transition={{ duration: 1, ease: "circIn" }}
          className="enroll-button"
          onClick={handle_enroll_btn}
        >
          <span>Enroll Now</span> <FaArrowRight className="arrow-icon" />{" "}
          <motion.div
            initial={{ opacity: 1, x: 100 }}
            // animate={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 0, x: -115 }}
            // transition={{ duration: 3, ease: "easeInOut" }}
            transition={{ ...transition, type: "tween" }}
            className="cta-btn-bg"
          ></motion.div>
           <motion.div
            initial={{ opacity: 1, x: -115 }}
            // animate={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 0, x: 100 }}
            // transition={{ duration: 3, ease: "easeInOut" }}
            transition={{ ...transition, type: "tween" }}
            className="cta-btn-bg"
          ></motion.div>
        </motion.button>
      </motion.div>
      <motion.div className="hero-right">
        <img className="hero-shape" src={hero_shape_2} alt="" />

        <div className="img-container">
          <motion.img
            src={hero_banner1}
            alt="Hero Banner"
            className="image-holder one"
            initial={{ opacity: 0, x: 300 }}
            whileInView={{ opacity: 1, x: -20 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            // transition={{ ...transition, type: "tween" }}
          />

          <motion.img
            src={hero_banner2}
            alt="Hero Banner"
            className="image-holder two"
            initial={{ opacity: 0, x: -300 }}
            whileInView={{ opacity: 1, x: 15 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
