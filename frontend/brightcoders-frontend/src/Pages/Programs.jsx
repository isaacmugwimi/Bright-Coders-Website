import React, { useState } from "react";
import "../Css/ProgramPage.css";
import { FaClock, FaCheckCircle, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import programData from "../Utils/programData";
import { useNavigate } from "react-router-dom";

const Programs = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null); // course for modal
  const handleEnrollBtn = (e) => {
    e.target.preventDefault;
    navigate("/register");
  };

  const handleCardClick = (item) => {
    setSelectedCourse(item);
    // navigate(
    //   "/course-detail"
    //   //   ,  {
    //   //   state: {
    //   //     selectedCourse: item.title,
    //   //     price: item.price,
    //   //     description: item.description, // optional in programData
    //   //     requirements: item.requirements,
    //   //     focus: item.focus,
    //   //   },
    //   // }
    // );
  };

  const handleEnroll = () => {
    if (selectedCourse) {
      navigate("/register", {
        state: {
          selectedCourse: selectedCourse.title,
          price: selectedCourse.price,
        },
      });
    }
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  // Motion Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="programs-page">
      {/* Header */}
      <motion.div
        className="programs-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={cardVariants}
      >
        <h1>Our Programs</h1>
        <p>Choose the perfect coding journey for your child.</p>
      </motion.div>

      {/* Program Categories */}
      {programData.map((section, index) => (
        <motion.div
          key={index}
          className="program-category"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariants}
        >
          <h2>{section.category}</h2>
          <div className="program-grid">
            {section.items.map((item, i) => (
              <motion.div
                className="program-card"
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleCardClick(item)}
                // onClick={() =>
                //   navigate("/register", {
                //     state: { selectedCourse: item.title },
                //   })
                // }
              >
                <img src={item.image} alt={item.title} />
                <div className="program-duration">
                  <FaClock /> {item.duration}
                </div>
                <h3>{item.title}</h3>
                <div className="focus-area">
                  <strong>Focus:</strong>
                  <div className="tags">
                    {item.focus.map((tag, t) => (
                      <span key={t} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="price">{item.price}</p>
                <span className={`level ${item.level.toLowerCase()}`}>
                  {item.level}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Benefits Section */}
      <motion.div
        className="benefits"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={cardVariants}
      >
        <h2>What’s Included</h2>
        <ul>
          <li>
            <FaCheckCircle /> Live teacher guidance
          </li>
          <li>
            <FaCheckCircle /> Hands-on projects
          </li>
          <li>
            <FaCheckCircle /> Certificates after completion
          </li>
          <li>
            <FaCheckCircle /> Progress updates for parents
          </li>
          <li>
            <FaCheckCircle /> Small class sizes
          </li>
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="program-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={cardVariants}
        whileHover={{ scale: 1.05 }}
      >
        <button onClick={handleEnrollBtn}> Enroll Now</button>
      </motion.div>

      {/* COURSE DETAIL MODAL */}

      {selectedCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <motion.div
            className="modal-box"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <button className="close-modal" onClick={closeModal}>
              <FaTimes />
            </button>

            <h1>{selectedCourse.title}</h1>
            <p className="price">{selectedCourse.price}</p>

            {/* Definition */}
            {selectedCourse.description?.definition && (
              <div className="course-section">
                <h2>What is this course?</h2>
                <p>{selectedCourse.description.definition}</p>
              </div>
            )}

            {/* Learning Points */}
            {selectedCourse.description?.learningPoints && (
              <div className="course-section">
                <h2>What you will learn</h2>
                <ul className="learning-points">
                  {selectedCourse.description.learningPoints.map(
                    (point, index) => (
                      <li key={index}>
                        <FaCheckCircle className="check-icon" /> {point}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Outcome */}
            {selectedCourse.description?.outcome && (
              <div className="course-section">
                <h2>Course Outcome</h2>
                <p>{selectedCourse.description.outcome}</p>
              </div>
            )}

            {/* Requirements */}
            {selectedCourse.requirements && (
              <div className="course-section">
                <h2>Requirements</h2>
                <ul>
                  {selectedCourse.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Focus Areas */}
            {selectedCourse.focus && (
              <div className="course-section">
                <h2>Focus Areas</h2>
                <div className="tags">
                  {selectedCourse.focus.map((f, i) => (
                    <span key={i} className="tag">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className="enroll-btn" onClick={handleEnroll}>
              Enroll Now
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Programs;
