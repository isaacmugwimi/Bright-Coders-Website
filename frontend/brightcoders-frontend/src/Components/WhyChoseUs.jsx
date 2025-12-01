import React from "react";
import "../Css/WhyChooseUs.css";
import whyChooseUsData from "../Utils/whyChoseUsData.js";

const WhyChooseUs = () => {
  return (
    <div className="why-choose-us">
      <h2 className="section-header">Why Choose Us?</h2>
      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>
      <p className="section-subheader">
        Our platform is designed to make learning easy, interactive, and
        effective.
      </p>
      <div className="features-container">
        {whyChooseUsData.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              <feature.Icon style={{ color: feature.color }} />
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
