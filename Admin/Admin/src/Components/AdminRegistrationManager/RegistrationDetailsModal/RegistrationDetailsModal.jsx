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
  Wallet,
  Receipt,
} from "lucide-react";
import "./RegistrationDetailsModal.css";
import { CertificateTemplate } from "./CertificateTemplate";

export const RegistrationDetailsModal = ({ registration, onClose }) => {
  const [directorName, setDirectorName] = useState("Dr. Floyed Muchiri");
  const [instructorName, setInstructorName] = useState(
    "Developer Isaac Mugwimi"
  );
  const [showCertPreview, setShowCertPreview] = useState(false);

  if (!registration) return null;

  // --- REFINED STATUS LOGIC ---
  const paymentStatus = registration.payment_status; // 'paid', 'partial', 'pending'
  const isFullyPaid = paymentStatus === "paid";
  const hasPaidSomething =
    paymentStatus === "paid" || paymentStatus === "partial";
  const balance = parseFloat(registration.balance_due) || 0;

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
          {/* SECTION 1: FINANCIAL BREAKDOWN (NEW & IMPORTANT) */}
          <div
            className="detail-section financial-summary"
            style={{ backgroundColor: "#fdfefe", border: "1px solid #e0e0e0" }}
          >
            <h3 style={{ color: "#2c3e50" }}>
              <Wallet size={18} /> Financial Breakdown
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Total Course Price:</label>
                <span style={{ fontWeight: "bold" }}>
                  Ksh{" "}
                  {parseFloat(registration.total_course_price).toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <label>Amount Paid:</label>
                <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                  Ksh {parseFloat(registration.amount_paid).toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <label>Current Balance:</label>
                <span
                  style={{
                    color: balance > 0 ? "#e74c3c" : "#27ae60",
                    fontWeight: "bold",
                  }}
                >
                  Ksh {balance.toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <label>Payment Plan:</label>
                <span
                  style={{ textTransform: "uppercase", fontSize: "12px" }}
                  className="badge info"
                >
                  {registration.payment_plan}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: STUDENT & COURSE INFO */}
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
                <label>Age/Grade:</label>{" "}
                <span>
                  {registration.age_group} ({registration.grade_group})
                </span>
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

          {/* SECTION 3: CONTACT DETAILS */}
          <div className="detail-section">
            <h3>
              <Phone size={18} /> Contact Details
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Parent:</label> <span>{registration.parent_name}</span>
              </div>
              <div className="detail-item">
                <label>Phone:</label> <span>{registration.parent_phone}</span>
              </div>
              <div className="detail-item">
                <label>Emergency:</label>{" "}
                <span>
                  {registration.emergency_contact} (
                  {registration.emergency_phone})
                </span>
              </div>
            </div>
          </div>

         {/* SECTION 4: STATUS & DOCUMENTS */}
<div className="detail-section document-section">
  <h3>
    <Receipt size={18} /> Status & Documents
  </h3>
  <div className="document-grid">
    <div className={`status-box ${paymentStatus}`}>
      <label>Payment Status</label>
      <div className="status-value">
        {isFullyPaid
          ? "✅ Fully Paid"
          : paymentStatus === "partial"
          ? "🟠 Partial Payment"
          : "⏳ Pending"}
      </div>
    </div>

    <div className="doc-actions">
      <div className="button-group">
        {/* 🔹 UPDATED: Use Cloudinary URL instead of Local Backend Route */}
        {registration.receipt_url ? (
          <button
            className="doc-btn receipt"
            onClick={() => window.open(registration.receipt_url, "_blank")}
          >
            <Download size={16} />{" "}
            {isFullyPaid
              ? "Download Receipt"
              : "Download Partial Receipt"}
          </button>
        ) : hasPaidSomething ? (
          // This handles cases where payment is recorded but the background 
          // processing/upload to Cloudinary hasn't finished yet.
          <p className="doc-pending" style={{ color: "#f39c12" }}>
            <Loader2 size={14} className="spinner" /> Generating Receipt...
          </p>
        ) : (
          <p className="locked-msg">
            Receipt locked until first payment.
          </p>
        )}

        {/* ONLY allow certificates for FULLY paid students */}
        {isFullyPaid ? (
          <button
            className="doc-btn cert"
            onClick={() => setShowCertPreview(true)}
          >
            <Award size={16} /> View Certificate
          </button>
        ) : (
          <span
            className="doc-pending"
            style={{ color: "#666", fontSize: "12px" }}
          >
            <ShieldCheck size={14} /> Certificate requires full payment.
          </span>
        )}
      </div>
    </div>
  </div>
</div>

          {/* SIGNATORY SETTINGS (Only if fully paid) */}
          {isFullyPaid && (
            <div
              className="detail-section admin-settings-box"
              style={{
                backgroundColor: "#f0f7ff",
                border: "1px dashed #2563eb",
                padding: "15px",
              }}
            >
              <h3 style={{ color: "#2563eb" }}>
                <Settings size={18} /> Certificate Signatories
              </h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Program Director:</label>
                  <input
                    type="text"
                    className="sig-input"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                  />
                </div>
                <div className="detail-item">
                  <label>Head of Instruction:</label>
                  <input
                    type="text"
                    className="sig-input"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
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
