import React, { useState } from "react";
import {
  FileText,
  Globe,
  UserCheck,
  Award,
  CreditCard,
  Download,
  ShieldCheck,
  Phone,
  Settings,
} from "lucide-react";
import "./RegistrationDetailsModal.css";
// Ensure this path matches where you saved the template file
import { CertificateTemplate } from "./CertificateTemplate";

export const RegistrationDetailsModal = ({ registration, onClose }) => {
  // --- STATE FOR CAPTURING SIGNATORIES ---
  const [directorName, setDirectorName] = useState("Dr. Floyed Muchiri");
  const [instructorName, setInstructorName] = useState(
    "Developer Isaac Mugwimi"
  );

  // State to toggle between Student Profile and Certificate Preview
  const [showCertPreview, setShowCertPreview] = useState(false);

  if (!registration) return null;

  // Logic for document availability
  const isPaid = registration.payment_status === "paid";
  const hasCertificate = true; // Kept as true for development preview

  // IF THE ADMIN CLICKS VIEW CERTIFICATE, SHOW THE TEMPLATE INSTEAD
  if (showCertPreview) {
    return (
      <CertificateTemplate
        registration={registration}
        onClose={() => setShowCertPreview(false)}
        directorName={directorName}
        instructorName={instructorName}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content detail-modal">
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div>
            <h2>Student Profile</h2>
            <small className="reg-number">
              {registration.registration_number}
            </small>
          </div>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* SECTION 1: STUDENT & COURSE INFO */}
          <div className="detail-section">
            <h3>
              <UserCheck size={18} /> Student & Course Info
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Full Name:</label> <span>{registration.child_name}</span>
              </div>
              <div className="detail-item">
                <label>Gender:</label> <span>{registration.gender}</span>
              </div>
              <div className="detail-item">
                <label>Age Group:</label> <span>{registration.age_group}</span>
              </div>
              <div className="detail-item">
                <label>Grade:</label> <span>{registration.grade_group}</span>
              </div>
              <div className="detail-item">
                <label>Course:</label> <span>{registration.course_name}</span>
              </div>
              <div className="detail-item">
                <label>Schedule:</label>{" "}
                <span>{registration.preferred_time}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACT & EMERGENCY */}
          <div className="detail-section">
            <h3>
              <Phone size={18} /> Contact Details
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Parent Name:</label>{" "}
                <span>{registration.parent_name}</span>
              </div>
              <div className="detail-item">
                <label>Parent Email:</label>{" "}
                <span>{registration.parent_email}</span>
              </div>
              <div className="detail-item">
                <label>Parent Phone:</label>{" "}
                <span>{registration.parent_phone}</span>
              </div>
              <div className="detail-item">
                <label>Emergency Contact:</label>{" "}
                <span>{registration.emergency_contact}</span>
              </div>
              <div className="detail-item">
                <label>Emergency Phone:</label>{" "}
                <span>{registration.emergency_phone}</span>
              </div>
              <div className="detail-item">
                <label>Heard From:</label>{" "}
                <span>{registration.heard_from || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* NEW SECTION: SIGNATURE SETTINGS (Only visible if paid) */}
          {isPaid && (
            <div
              className="detail-section admin-settings-box"
              style={{
                backgroundColor: "#f0f7ff",
                border: "1px dashed #2563eb",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Settings size={18} /> Certificate Signatories
              </h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Program Director:</label>
                  <input
                    type="text"
                    className="sig-input"
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      marginTop: "5px",
                    }}
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                  />
                </div>
                <div className="detail-item">
                  <label>Head of Instruction:</label>
                  <input
                    type="text"
                    className="sig-input"
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      marginTop: "5px",
                    }}
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: STATUS & DOCUMENTS */}
          <div className="detail-section document-section">
            <h3>
              <CreditCard size={18} /> Status & Documents
            </h3>
            <div className="document-grid">
              <div className={`status-box ${registration.payment_status}`}>
                <label>Payment Status</label>
                <div className="status-value">
                  {isPaid ? "✅ Fully Paid" : "⏳ Pending Verification"}
                </div>
              </div>

              <div className="doc-actions">
                {isPaid ? (
                  <div className="button-group">
                    <button
                      className="doc-btn receipt"
                      onClick={() => {
                        const downloadUrl = `http://localhost:8000/api/registration/download-receipt/${registration.registration_number}`;
                        window.open(downloadUrl, "_blank");
                      }}
                    >
                      <Download size={16} /> Download Receipt
                    </button>

                    {hasCertificate ? (
                      <button
                        className="doc-btn cert"
                        onClick={() => setShowCertPreview(true)}
                      >
                        <Award size={16} /> View Certificate
                      </button>
                    ) : (
                      <span className="doc-pending">
                        Certificate: Not Yet Issued
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="locked-msg">
                    Documents will be available after payment verification.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: TECHNICAL & LOGISTICS */}
          <div className="detail-section">
            <h3>
              <Globe size={18} /> Technical Readiness
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Device Type:</label>{" "}
                <span>{registration.device_type}</span>
              </div>
              <div className="detail-item">
                <label>Internet:</label>{" "}
                <span>{registration.internet_quality}</span>
              </div>
              <div className="detail-item">
                <label>M-Pesa Code:</label>{" "}
                <span className="mpesa-text">{registration.mpesa_code}</span>
              </div>
              <div className="detail-item">
                <label>Consent Given:</label>
                <span>{registration.consent ? "✅ Authorized" : "❌ No"}</span>
              </div>
            </div>
            <div
              className="detail-item full-width"
              style={{ marginTop: "15px" }}
            >
              <label>Admin/Parent Notes:</label>
              <p className="notes-box">
                {registration.notes || "No additional notes provided."}
              </p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={() => window.print()}>
            <FileText size={16} /> Print Profile
          </button>
        </div>
      </div>
    </div>
  );
};
