import React from "react";
import "../Css/AboutHomepage.css";
import { useNavigate } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import about_img from "../assets/about-image.webp";
import AboutSection from "./AboutSection";
import { Helmet } from "react-helmet-async";

const AboutHomepage = () => {
  const navigate = useNavigate();

  const handleReadMoreBtn = () => {
    navigate("/about");
  };

  return (
    <>
      {/* SEO META */}
      <Helmet>
        <title>About Bright Coders | Fun & Creative Coding Education</title>
        <meta
          name="description"
          content="Learn about Bright Coders — empowering young minds through creative, fun, and practical coding education for future innovators."
        />
      </Helmet>

      <section className="about-section" aria-labelledby="about-heading">
        <h1 id="about-heading" className="header">
          About Us
        </h1>

        <div className="horizontal-line">
          <div className="actual-line"></div>
        </div>

        <p className="header-paragraph">
          Empowering young minds through creative and fun coding education.
        </p>

        <section className="aboutHomepage">
          <div className="aboutLeft">
            <img
              src={about_img}
              alt="Students learning coding at Bright Coders"
              loading="lazy"
              width="500"
              height="350"
            />
          </div>

          <div className="aboutRight">
            <AboutSection />

            <button
              className="read-more-btn"
              onClick={handleReadMoreBtn}
              aria-label="Read more about Bright Coders"
            >
              Read More
              <MdArrowForward style={{ fontSize: "20px" }} />
            </button>
          </div>
        </section>
      </section>
    </>
  );
};

export default AboutHomepage;
