import React from "react";
import howItWorksData from "../Utils/HowItWorksCard";
import "../Css/HowItWorksCard.css";
const HowItWorksCard = () => {
  return (
    <div className="howItWorksCard-card-body">
      {howItWorksData.map((step) => (
        <div className="step-card" key={step.id}>
          <div className="steps-icon-section">
            <step.Icon className="step-icon" style={{ color: step.color }} />
            <div className="steps-overlay">{step.step}</div>
          </div>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HowItWorksCard;
