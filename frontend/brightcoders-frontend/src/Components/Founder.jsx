import React from "react";
import "../Css/Founder.css";
import founderImg from "../assets/AirBrush_20250725153208.jpg"; // replace with your real image

const Founder = () => {
  return (
    <div className="founder-container">
      {/* Hero Section */}
      <div className="founder-hero">
        <h1>Meet the Founder</h1>
        <p>
          Inspiring young minds through creativity, technology, and innovation.
        </p>
      </div>

      {/* Founder Section */}
      <div className="founder-wrapper">
        <div className="founder-image">
          <img src={founderImg} alt="Founder" />
        </div>

        <div className="founder-details">
          <h2>Floyd Muchiri</h2>
          <h4>Founder & Lead Instructor – Bright Coders</h4>

          <p className="bio-text">
            Floyd is a passionate educator and technology enthusiast dedicated
            to empowering the next generation through coding and digital
            creativity. With years of hands-on experience teaching young
            learners, he founded <strong>Bright Coders</strong> to give children
            the tools, mindset, and confidence they need to thrive in a
            fast-changing world.
          </p>

          <p className="bio-text">
            His teaching approach blends fun, creativity, and practical
            problem-solving—making coding accessible and exciting for kids of
            all learning levels.
          </p>

          <a href="/about" className="read-story-btn">
            Read Our Story
          </a>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="founder-philosophy">
        <h2>My Teaching Philosophy</h2>

        <div className="philosophy-cards">
          <div className="philosophy-card">
            <h3>✨ Fun & Adventure</h3>
            <p>
              Kids learn best when the process is enjoyable. Every lesson blends
              creativity and exploration.
            </p>
          </div>

          <div className="philosophy-card">
            <h3>💡 Real Thinking</h3>
            <p>
              I encourage learners to think critically, experiment, and solve
              problems independently.
            </p>
          </div>

          <div className="philosophy-card">
            <h3>🚀 Confidence First</h3>
            <p>
              Students build confidence by creating projects they’re proud
              of—from games to websites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Founder;
