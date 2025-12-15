// frontend/brightcoders-frontend/src/Pages/CourseDetail.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import "../Css/CourseDetail.css";
import { FaArrowLeft } from "react-icons/fa";

export default function CourseDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCourse, price, description, requirements, focus } =
    location.state || {};

  if (!selectedCourse) {
    // Redirect back if no course is passed
    navigate("/programs");
  }

  return (
    <div className="course-detail-page">
      <button className="back-btn" onClick={() => navigate("/programs")}>
        <FaArrowLeft /> Back
      </button>

      <h1>{selectedCourse}</h1>
      <p className="price">Price: {price}</p>

      {description && (
        <>
          <h2>Description</h2>
          <p>{description}</p>
        </>
      )}

      {requirements && (
        <>
          <h2>Requirements</h2>
          <ul>
            {requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </>
      )}

      {focus && (
        <>
          <h2>Focus Areas</h2>
          <ul>
            {focus.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </>
      )}

      <button
        className="enroll-btn"
        onClick={() =>
          navigate("/register", { state: { selectedCourse, price } })
        }
      >
        Enroll Now
      </button>
    </div>
  );
}
