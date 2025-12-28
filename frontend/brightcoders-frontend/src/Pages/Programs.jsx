import React, { useState, useEffect } from "react";
import "../Css/ProgramPage.css";
import {
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaClipboardCheck,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Programs = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 1. Fetch only LIVE courses from the database
  useEffect(() => {
    const fetchLiveCourses = async () => {
      try {
        setLoading(true);
        // Ensure this matches your backend route
        const response = await axios.get(
          "http://localhost:8000/api/courses/live"
        );
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveCourses();
  }, []);

  // 2. Group the database results by category
  const groupedCourses = courses.reduce((acc, course) => {
    const category = course.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(course);
    return acc;
  }, {});

  const categories = Object.keys(groupedCourses).sort();

  const handleEnrollBtn = () => navigate("/register");

  const handleCardClick = (item) => setSelectedCourse(item);

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

  const closeModal = () => setSelectedCourse(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="programs-page">
      {/* Header */}
      <section className="programs-hero">
        <div className="hero-image-overlay"></div>
        <div className="hero-content">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hero-badge"
          >
            BRIGHT CODERS ACADEMY
          </motion.span>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Empowering Your Child's <br />
            <span className="highlight">Digital Future</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Expert-led coding programs designed for the next generation of
            African tech leaders.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="hero-cta"
            onClick={() =>
              document
                .getElementById("programs-grid")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            View All Courses
          </motion.button>
        </div>
      </section>

      <section id="programs-grid">
        {loading ? (
          <div className="loading-container" id="programs-grid">
            <div className="simple-spinner"></div>
            <p>Fetching latest programs...</p>
          </div>
        ) : (
          <div className="content-wrapper">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <motion.div
                  key={index}
                  className="program-category"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={cardVariants}
                >
                  <h2>{category}</h2>
                  <div className="program-grid">
                    {groupedCourses[category].map((item) => (
                      <motion.div
                        className="program-card"
                        key={item.id}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => handleCardClick(item)}
                      >
                        <img
                          src={item.image_url || "/placeholder.png"}
                          alt={item.title}
                        />
                        <div className="program-duration">
                          <FaClock /> {item.duration}
                        </div>
                        <h3>{item.title}</h3>
                        <div className="focus-area">
                          <strong>Focus:</strong>
                          <div className="tags">
                            {item.focus &&
                              item.focus.map((tag, t) => (
                                <span key={t} className="tag">
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                        <p className="price">Ksh. {item.price}</p>
                        <span className={`level ${item.level?.toLowerCase()}`}>
                          {item.level}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-programs">
                <h3>No programs live at the moment.</h3>
                <p>Check back later or browse our upcoming courses!</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <div className="benefits">
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
      </div>

      <div className="program-cta">
        <button onClick={handleEnrollBtn}>Enroll Now</button>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            className="modal-overlay"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-box"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal" onClick={closeModal}>
                <FaTimes />
              </button>

              <h1>{selectedCourse.title}</h1>
              <div className="price-section">{selectedCourse.price}</div>

              {/* description comes from JSONB on backend */}
              {selectedCourse.description?.definition && (
                <div className="course-section">
                  <h2>What is this course?</h2>
                  <p>{selectedCourse.description.definition}</p>
                </div>
              )}

              {selectedCourse.description?.learningPoints && (
                <div className="course-section">
                  <h2>What you will learn</h2>
                  <ul className="learning-points">
                    {selectedCourse.description.learningPoints.map(
                      (point, i) => (
                        <li key={i}>
                          <FaCheckCircle className="check-icon" /> {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

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
                      <li key={index}>
                        <div className="requirement-section">
                          <FaClipboardCheck
                            className="section-icon"
                            size={20}
                          />
                          {req}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Focus Areas */}
              {selectedCourse.focus && (
                <div className="course-section">
                  <h2>Focus Areas</h2>
                  <div className="tags tag-modal">
                    {selectedCourse.focus.map((f, i) => (
                      <span key={i} className="tag ">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Programs;
