import React from "react";
import "../Css/AboutHomepage.css";
import { useNavigate } from "react-router-dom";
import { MdArrowForward } from "react-icons/md"; // Material Designimport { useNavigate } from "react-router-dom";
import about_img from "../assets/about-image.webp";
import AboutSection from "./AboutSection";
const AboutHomepage = () => {
  const navigate = useNavigate();
  const handleReadMoreBtn = (e) => {
    e.preventDefault();
    navigate("/about");
  };
  return (
    <div className="about-section">
      <h1 className="header">About Us</h1>
      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>
      <p className="header-paragraph">
        Empowering young minds through creative and fun coding education.{" "}
      </p>

      <section className="aboutHomepage">
        <div className="aboutLeft">
          <img src={about_img} alt="" />
        </div>
        <div className="aboutRight">
         
         <AboutSection/>
         <button className="read-more-btn" onClick={handleReadMoreBtn}>
            Read More... <MdArrowForward style= {{fontSize:"20px"}} />
          </button>
        </div>
         
      </section>
      
    </div>
  );
};

export default AboutHomepage;
