import React from "react";
import "../Css/About2.css";

const AboutSection = () => {
  return (
    <div className="about-section2">

      {/* Background shapes */}
      <div className="bg-shapes">
        <div className="shape s1"></div>
        <div className="shape s2"></div>
        <div className="shape s3"></div>
      </div>

      {/* Diamond card */}
      <div className="about-card">
        <h2>About Us</h2>
        <p>
          We are committed to providing young learners with a solid foundation
          in programming. Our curriculum is designed to make coding fun,
          engaging, and easy for beginners.
        </p>
      </div>

    </div>
  );
};

export default AboutSection;
