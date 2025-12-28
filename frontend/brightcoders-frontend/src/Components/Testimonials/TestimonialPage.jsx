import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaRegStar, FaStar, FaUserAlt } from "react-icons/fa";
import { RiDoubleQuotesR } from "react-icons/ri";
import {
  validateImage,
  validateTestimonial,
} from "../../helper/validateTestimonial";
import "./TestimonialPage.css";
import { useNavigate } from "react-router-dom";

const TestimonialPage = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  // --- States ---
  const [formData, setFormData] = useState({
    user_name: "",
    user_role: "",
    message: "",
    rating: 5,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [liveTestimonials, setLiveTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValid = validateImage(file);
      if (isValid) {
        setImage(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setErrors({ ...errors, image: "" });
      }
    } else {
      // If invalid, clear the input
      e.target.value = "";
    }
  };

  const fetchLiveReviews = async () => {
    try {
      const response = await axios.get(
        `${API_URL.replace(/\/$/, "")}/api/testimonials/live`
      );
      setLiveTestimonials(response.data);
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveReviews();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateTestimonial(
      formData,
      image
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("userName", formData.user_name);
    data.append("userRole", formData.user_role);
    data.append("message", formData.message);
    data.append("rating", formData.rating);
    if (image) data.append("image", image);

    try {
      const submitPath = `${API_URL.replace(
        /\/$/,
        ""
      )}/api/testimonials/submit`;
      await axios.post(submitPath, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Success! Your story is waiting for approval.");
      setFormData({ user_name: "", user_role: "", message: "", rating: 5 });
      setImage(null);
      setPreview(null);
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="simple-spinner"></div>
        <p>Loading stories...</p>
      </div>
    );

  return (
    <div className="testimonial-wrapper">
      {/* 1. HERO HEADER WITH IMAGE BACKGROUND */}
      <header className="testimonial-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Hear From Our Amazing Students!</h1>
          <p>Real stories, real success. Discover what you can do.</p>
          <div className="hero-btns">
            <button
              className="btn-primary"
              onClick={() => navigate("/programs")}
            >
              Explore Courses
            </button>
            <button
              className="btn-outline"
              onClick={() =>
                document
                  .getElementById("success-stories")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Read All Stories
            </button>
          </div>
        </div>
      </header>

      {/* 2. TESTIMONIALS DISPLAY SECTION */}
      <section className="testimonials-display-section" id="success-stories">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <div className="testimonial-grid">
            {liveTestimonials.map((item) => (
              <div className="testimonial-card" key={item.id}>
                <div className="card-quotes">
                  <RiDoubleQuotesR />
                </div>

                <p className="card-message">"{item.message}"</p>

                <div className="card-footer">
                  <div className="user-info">
                    <div className="user-img-wrapper">
                      {item.image_url ? (
                        <>
                          {" "}
                          <img
                            src={
                              item.image_url.startsWith("http")
                                ? item.image_url
                                : `${API_URL.replace(
                                    /\/$/,
                                    ""
                                  )}/${item.image_url.replace(/^\//, "")}`
                            }
                            alt={item.user_name}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150?text=User"; // Fallback image
                            }}
                          />
                        </>
                      ) : (
                        <FaUserAlt />
                      )}
                    </div>
                    <div>
                      <h4>{item.user_name}</h4>
                      <span>{item.user_role}</span>
                    </div>
                  </div>

                  <div className="card-stars">
                    {[...Array(5)].map((_, i) =>
                      i < item.rating ? (
                        <FaStar key={i} className="star-filled" />
                      ) : (
                        <FaRegStar key={i} />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SUBMISSION FORM SECTION */}
      <section className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h2>Share Your Journey</h2>
            <p>Tell us about your experience at Bright Coders.</p>
          </div>

          <form onSubmit={handleSubmit} className="testimonial-form">
            <div className="form-row">
              <div className="field-group">
                <label>FULL NAME</label>
                <input
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                  className={errors.user_name ? "input-err" : ""}
                />
                {errors.user_name && (
                  <small className="err-msg">{errors.user_name}</small>
                )}
              </div>

              <div className="field-group">
                <label>CATEGORY / ROLE</label>
                <input
                  name="user_role"
                  value={formData.user_role}
                  onChange={handleChange}
                  placeholder="e.g., Coding Student"
                  className={errors.user_role ? "input-err" : ""}
                />
                {errors.user_role && (
                  <small className="err-msg">{errors.user_role}</small>
                )}
              </div>
            </div>

            <div className="field-group">
              <label>YOUR EXPERIENCE</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="A brief catchphrase for your testimonial card..."
                className={errors.message ? "input-err" : ""}
              />
              {errors.message && (
                <small className="err-msg">{errors.message}</small>
              )}
            </div>

            <div className="form-flex-bottom">
              <div className="field-group">
                <label>RATING</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} Stars
                    </option>
                  ))}
                </select>
              </div>

              {/* DASHED UPLOAD AREA */}
              <div className="upload-container">
                <label>PROFILE MEDIA</label>
                <p className="help-text">Max size: 2MB (JPG, PNG, WebP)</p>
                <div
                  className={`dashed-upload-box ${
                    errors.image ? "box-err" : ""
                  }`}
                >
                  <input
                    type="file"
                    id="img-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                  <label htmlFor="img-upload" className="upload-box-content">
                    {preview ? (
                      <div className="preview-mode">
                        <img src={preview} alt="preview" />
                        <div className="preview-overlay">
                          <FaCloudUploadAlt />
                          <span>Change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="placeholder-mode">
                        <FaCloudUploadAlt />
                        <span>Upload Photo</span>
                      </div>
                    )}
                  </label>
                </div>
                {errors.image && (
                  <small className="err-msg">{errors.image}</small>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Testimonial"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TestimonialPage;
