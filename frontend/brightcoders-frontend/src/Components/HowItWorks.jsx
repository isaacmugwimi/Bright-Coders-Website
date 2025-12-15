import React from "react";
import "../Css/HowItWorks.css";
import right_image from "../assets/searching.webp";
import graduate from "../assets/graduate.jpg";
import learner from "../assets/learner.webp";
import { FaCheckCircle } from "react-icons/fa";
import HowItWorksCard from "../Cards/HowItWorksCard";
import { MdReadMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const HowItWorks = () => {
  const navigate = useNavigate();
  const handleViewMoreBtn = (e) => {
    e.target.preventDefault;
    navigate("/programs");
  };
  return (
    <div className="howItWorkSection">
      <h1 className="header">How It Works</h1>
      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>
      <p className="header-paragraph">
        Getting started is simple — follow these three steps
      </p>
      <div className="main-work-section">
        <div className="left-section">
          <h3 className="left-header">
            <FaCheckCircle size={45} color="darkgreen" /> 3 Easy Way To Get
            Started With Bright Coders
          </h3>
          <HowItWorksCard />
        </div>
        <div className="right-section">
          <div className="right-image-section">
            <img src={right_image} alt="" />
            <img src={learner} alt="" />
            <img src={graduate} alt="" />
          </div>
        </div>
      </div>
      <button className="view-more-btn" onClick={handleViewMoreBtn}>
        Get Started
        <MdReadMore className="arrow-right" />
      </button>
    </div>
  );
};

export default HowItWorks;
