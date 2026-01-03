import React from "react";
import {
  Star,
  Quote,
  X,
  Calendar,
  User,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const TestimonialViewModal = ({ testimonial, onClose }) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  if (!testimonial) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content view-testimonial-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="header-title-set">
            <span
              className={`status-pill ${
                testimonial.is_approved ? "live" : "draft"
              }`}
            >
              {testimonial.is_approved ? (
                <ShieldCheck size={14} />
              ) : (
                <ShieldAlert size={14} />
              )}
              {testimonial.is_approved ? "Live on Site" : "Pending Approval"}
            </span>
            <h2>Feedback Details</h2>
          </div>
          <button className="close-x" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body testimonial-preview-body">
          <div className="testimonial-profile-header">
            <img
              src={
                testimonial.image_url
                  ? testimonial.image_url.startsWith("http")
                    ? testimonial.image_url
                    : `${API_URL.replace(
                        /\/$/,
                        ""
                      )}/${testimonial.image_url.replace(/^\//, "")}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      testimonial.user_name
                    )}`
              }
              className="avatar-sm"
              style={{ width: "100px", height: "100px" }}
              alt={testimonial.user_name}
            />
            <div className="profile-info">
              <h3>{testimonial.user_name}</h3>
              <p className="role-text">{testimonial.user_role || "Student"}</p>
              <div className="rating-row">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < testimonial.rating ? "#ffc107" : "none"}
                    color={i < testimonial.rating ? "#ffc107" : "#e2e8f0"}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="message-quote-box">
            <Quote className="quote-icon" size={32} style={{color:"darkcyan"}} />
            <p className="full-message">{testimonial.message}</p>
          </div>

          <div className="preview-footer-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span style={{ marginLeft: "10px" }}>
                Received on:{" "}
                {new Date(testimonial.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialViewModal;
