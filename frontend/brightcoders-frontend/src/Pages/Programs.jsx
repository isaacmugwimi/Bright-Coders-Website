import React from "react";
import "../Css/ProgramPage.css";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import programData from "../Utils/programData";
import { useNavigate } from "react-router-dom";

const Programs = () => {
  const navigate = useNavigate();
  const handleEnrollBtn = (e) => {
    e.target.preventDefault;
    navigate("/register");
  };

  const handleCardClick = (item) => {
    navigate("/register", {
      state: { selectedCourse: item.title, price: item.price },
    });
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
                onClick={()=>handleCardClick(item)}
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
    </div>
  );
};

export default Programs;
