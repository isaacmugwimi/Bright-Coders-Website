import React from "react";
import "../Css/Home.css";
import { useTypewriter, Cursor } from "react-simple-typewriter";
// import heroIllustration from "../assets/hero-image.png"; // Save the image I provided here
import heroIllustration from "../assets/gemini2.png";
import NumberCounter from "number-counter";

const Home = () => {
  const [text] = useTypewriter({
    words: ["Future.", "Dream.", "Product."],
    loop: 0,
    typeSpeed: 80,
    deleteSpeed: 50,
    delaySpeed: 1500,
  });
  return (
    <div className="hero-wrapper">
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-text-section">
          <div className="hero-badge">
            <span>🚀</span> Master the Art of Shipping Code
          </div>

          <div className="wavy-text">
            <h1>Bright Coders</h1>
          </div>

          <h1 className="hero-main-title">
            Build the <span className="text-highlight">{text}</span>
            <span className="cursor-style">
              <Cursor cursorStyle="✏️" />
            </span>
            <br />
            One Line at a Time.
          </h1>

          <p className="hero-description">
            Fun, friendly coding classes for Grades 1–3, 4–6 & 7–9. No prior
            experience required.
          </p>

          <div className="hero-action-btns">
            <button className="btn-get-started">Get Started</button>
            <button className="btn-view-courses">View Courses</button>
          </div>

          <div className="hero-mini-stats">
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
                <NumberCounter postFix="+" start={10} delay={2} end={95} />
              </h3>
              <p>Projects</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        {/* <div className="hero-image-section"> */}
        {/* Right Image */}
        <div className="hero-image">
          <img src={heroIllustration} alt="Bright Coders Illustration" />
        </div>
        {/* </div> */}
      </div>

      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <p>Scroll Down</p>
      </div>
    </div>
  );
};

export default Home;
