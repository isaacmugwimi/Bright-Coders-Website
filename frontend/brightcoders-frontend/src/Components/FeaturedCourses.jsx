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
    e.target.preventDefault;
    navigate("/programs");
  };
  return (
    <motion.div
      className="featured"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="header">Featured Courses</h1>
      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>
      <p className="header-paragraph">
        Explore our most popular courses this month.
      </p>
      <div className="featured-cards-container">
        {featuredCourseData.map((course, index) => (
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
        ))}
      </div>
      <button className="view-more-btn" onClick={handleViewMoreBtn}>
        View More Courses
        <MdReadMore className="arrow-right" />
      </button>
    </motion.div>
  );
};

export default FeaturedCourses;
