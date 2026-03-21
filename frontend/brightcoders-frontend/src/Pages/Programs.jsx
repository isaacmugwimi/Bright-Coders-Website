import React, { useState, useEffect } from "react";
import "../Css/ProgramPage.css";
import {
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaClipboardCheck,
  FaShareAlt,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const Programs = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const siteUrl = import.meta.env.VITE_SITE_URL;

  // 1. Fetch only LIVE courses from the database
  useEffect(() => {
    const fetchLiveCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/courses/live`);
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

  const handleShare = async () => {
    if (!selectedCourse) return;

    const shareData = {
      title: `Check out ${selectedCourse.title} at Bright Coders!`,
      text: `Interested in coding? Look at this ${selectedCourse.title} course for kids.`,
      url: window.location.href, // Or a specific course link if you have slug-based routing
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard if Web Share API isn't supported
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
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

  // ================= SEO: JSON-LD =================
  const generateJSONLD = () => {
    if (!courses.length) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: courses.map((course, index) => ({
        "@type": "Course",
        position: index + 1,
        name: course.title,
        description: Array.isArray(course.focus)
          ? course.focus.join(", ")
          : course.focus,
        provider: {
          "@type": "EducationalOrganization",
          name: "Bright Coders",
          url: siteUrl,
        },
      })),
    };
  };

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>Programs | Kids Coding Courses in Kenya | Bright Coders</title>

        <meta
          name="description"
          content="Explore Bright Coders’ fun and interactive coding programs for children aged 5–14. Learn programming, problem-solving, and digital skills."
        />

        <meta
          name="keywords"
          content="kids coding programs, coding courses for children, programming for kids Kenya, Bright Coders courses"
        />

        <link rel="canonical" href={`${siteUrl}/programs`} />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Kids Coding Programs | Bright Coders"
        />
        <meta
          property="og:description"
          content="Expert-led coding programs designed for young learners to build real-world digital skills."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/programs`} />
        <meta property="og:image" content={`${siteUrl}/og-programs.jpg`} />

        {/* Structured Data */}
        {courses.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(generateJSONLD())}
          </script>
        )}
      </Helmet>

      {/* ================= PAGE ================= */}
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
                          <span
                            className={`level ${item.level?.toLowerCase()}`}
                          >
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
                        ),
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

                <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="enroll-btn" onClick={handleEnroll} style={{ flex: 1 }}>
                  Enroll Now
                </button>
                
                <button 
                  className="share-btn" 
                  onClick={handleShare}
                  title="Share this course"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FaShareAlt />
                </button>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Programs;
