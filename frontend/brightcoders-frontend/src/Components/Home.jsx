import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import hero_banner1 from "../assets/banner2.avif";
import hero_banner2 from "../assets/hero-banner-2.jpg";
import hero_shape_2 from "../assets/hero-shape-2.png";
import { FaArrowRight } from "react-icons/fa";

import "../Css/Home.css";

const mobileImages = [
  "https://imgs.search.brave.com/oWvu_zBGZluKc_2Xbm3q-fDUgnFG_OXq5_rHTogIZk8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDkv/NzUxLzI4My9zbWFs/bC9jb2Rpbmctc2Ny/aXB0LXRleHQtb24t/c2NyZWVuLWNvZGUt/aW4tYnJhY2tldC1z/b2Z0d2FyZS1waG90/by5qcGc",
  "https://imgs.search.brave.com/UiWu-MK7_fZpT-OeS1mNfeQcxiYhgK5ehe_l6Q8yQgQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE3/MTE3MTg2NC9waG90/by9oaXNwYW5pYy1s/YXRpbi1hbWVyaWNh/bi1zb2Z0d2FyZS1l/bmdpbmVlci1kZXZl/bG9wZXItdXNlLWxh/cHRvcC1jb21wdXRl/ci1wcm9ncmFtLWNv/ZGluZy5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9X0U4Mk5N/Y3YzbkE4WHhsdjY4/Tjg1MzRQcU9xZVNK/bUpJTkYtYnlQWUd5/OD0",
  "https://imgs.search.brave.com/qir1eJcX1fjReCQvKlabItHQBq6ZtoWIgb4rNY5_4wk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjYv/ODcyLzY5My9zbWFs/bC9sYXB0b3AtaW4t/ZnJvbnQtb2YtZGF0/YS1jZW50ZXItZW5n/aW5lZXJzLWRlcGxv/eWluZy1hcnRpZmlj/aWFsLWludGVsbGln/ZW5jZS10b29scy1h/aS1jb2Rpbmctb24t/bm90ZWJvb2stc2Ny/ZWVuLW5leHQtdG8t/dGVjaG5pY2lhbnMt/aW5zcGVjdGluZy1z/ZXJ2ZXItY2x1c3Rl/cnMtY2FtZXJhLWEt/Y2xvc2UtdXAtcGhv/dG8uanBn",
  "https://imgs.search.brave.com/4TTj2dchR4EQjvd_DT24OEBx-yhygW2BiYofqb9xAEo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDkv/NzUxLzI4NS9zbWFs/bC9jb2Rpbmctc2Ny/aXB0LXRleHQtb24t/c2NyZWVuLWNvZGUt/aW4tYnJhY2tldC1z/b2Z0d2FyZS1waG90/by5qcGc",
  "https://imgs.search.brave.com/cyMDpDugCNy9FEl7I_xyUEg51Az41Q0NGpbQF3hhU-o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjU0/Nzk4Njc2L3Bob3Rv/L2tpZHMtY29kaW5n/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1ULUtKbDBtN3c3/Ymd6S1U3dnRXb3JQ/UWxCS1p0WTBFYzF5/dmprWTl6ZWdrPQ",
];

const Home = () => {
  const navigate = useNavigate();
  const [word, setWord] = useState("Code");
  const [currentIndex, setCurrentIndex] = useState(0);

  const transition = { type: "easeIn", duration: 3 };

  useEffect(() => {
    const words = ["Imagine", "Solve Problems", "Code", "Play", "Explore Tech"];
    let index = 0;

    const wordInterval = setInterval(() => {
      setWord(words[index]);
      index = (index + 1) % words.length;
    }, 4000);

    const sliderInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mobileImages.length);
    }, 4000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(sliderInterval);
    };
  }, []);

  const handle_enroll_btn = (e) => {
    e.preventDefault();
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
        <motion.button className="enroll-button" onClick={handle_enroll_btn}>
          <span>Enroll Now</span> <FaArrowRight className="arrow-icon" />
          <motion.div
            initial={{ opacity: 1, x: 100 }}
            whileInView={{ opacity: 0, x: -115 }}
            transition={{ ...transition, type: "tween" }}
            className="cta-btn-bg"
          ></motion.div>
          <motion.div
            initial={{ opacity: 1, x: -115 }}
            whileInView={{ opacity: 0, x: 100 }}
            transition={{ ...transition, type: "tween" }}
            className="cta-btn-bg"
          ></motion.div>
        </motion.button>

        {/* Mobile Slider */}
        <div className="mobile-img-carousel">
          <AnimatePresence>
            <motion.img
              key={currentIndex} // Changes every interval
              src={mobileImages[currentIndex]} // Current image
              alt="Mobile Banner"
              initial={{ opacity: 0, scale: 0.8 }} // ← starting state: invisible and slightly smaller
              animate={{ opacity: 1, scale: 1 }} // ← final state: fully visible and normal size
              exit={{ opacity: 0, scale: 0.8 }} // ← when leaving: fade out and shrink slightly
              transition={{ duration: 1 }} // ← animation duration
            />
          </AnimatePresence>
        </div>
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
