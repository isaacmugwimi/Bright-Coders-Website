import React from "react";
import "../Css/FeaturedCourses.css";
import FeaturedCourseCard from "../Cards/FeaturedCourseCard";
import featuredCourseData from "../Utils/featuredCourseData.js";
import { MdReadMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FeaturedCourses = () => {
  const navigate = useNavigate();
  const handleViewMoreBtn = (e) => {
    e.preventDefault();
    navigate("/programs");
  };
  return (
    <div className="featured">
      <h1 className="header">Featured Courses</h1>
      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>
      <p className="header-paragraph">
        Explore our most popular courses this month.
      </p>
      <motion.div
        className="featured-cards-container"
        initial="hidden"
        animate="visible"
        whileInView="visible" // animate when container is in view
      >
        {featuredCourseData.map((course, index) => (
          <div className="features-card">
            <FeaturedCourseCard
              key={index}
              image={course.image}
              header={course.header1}
              title={course.title}
              focus={course.focus}
              duration={course.duration}
              fee={course.fee}
              DurationIcon={course.DurationIcon}
            />
          </div>
        ))}
      </motion.div>
      <button className="view-more-btn" onClick={handleViewMoreBtn}>
        View More Courses
        <MdReadMore className="arrow-right" />
      </button>
    </div>
  );
};

export default FeaturedCourses;
