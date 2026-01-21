import React from "react";
import "../Css/HowItWorks.css";
import right_image from "../assets/searching.webp";
import graduate from "../assets/graduate.jpg";
import learner from "../assets/learner.webp";
import { FaCheckCircle } from "react-icons/fa";
import HowItWorksCard from "../Cards/HowItWorksCard";
import { MdReadMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleViewMoreBtn = (e) => {
    e.preventDefault();
    navigate("/programs");
  };

  /* ✅ Google-friendly HowTo structured data */
  const howItWorksJSONLD = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get Started with Bright Coders",
    description:
      "Learn how to start learning programming at Bright Coders in three simple steps.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose a Program",
        text: "Select a programming course that matches your goals.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enroll & Learn",
        text: "Join the class and start learning with expert mentors.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Graduate & Get Certified",
        text: "Complete the course and receive your Bright Coders certificate.",
      },
    ],
  };

  return (
    <section
      className="howItWorkSection"
      aria-labelledby="how-it-works-heading"
    >
      {/* ✅ SEO */}
      <Helmet>
        <title>How It Works | Start Learning at Bright Coders</title>
        <meta
          name="description"
          content="Getting started with Bright Coders is easy. Follow three simple steps to enroll, learn programming, and earn your certification."
        />
        <script type="application/ld+json">
          {JSON.stringify(howItWorksJSONLD)}
        </script>
      </Helmet>

      {/* Heading */}
      <h2 id="how-it-works-heading" className="header">
        How It Works
      </h2>

      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>

      <p className="header-paragraph">
        Getting started is simple — follow these three steps
      </p>

      <div className="main-work-section">
        {/* LEFT */}
        <div className="left-section">
          <h3 className="left-header">
            <FaCheckCircle size={45} color="darkgreen" aria-hidden="true" /> 3
            Easy Ways To Get Started With Bright Coders
          </h3>

          <HowItWorksCard />
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <div className="right-image-section">
            <img
              src={right_image}
              alt="Student exploring programming courses at Bright Coders"
              loading="lazy"
            />
            <img
              src={learner}
              alt="Student learning coding skills online at Bright Coders"
              loading="lazy"
            />
            <img
              src={graduate}
              alt="Graduate receiving Bright Coders programming certificate"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="view-more-btn" onClick={handleViewMoreBtn}>
        Get Started
        <MdReadMore className="arrow-right" aria-hidden="true" />
      </button>
    </section>
  );
};

export default HowItWorks;
