// Multi-Step Registration Form (React + External CSS)
// This file uses a 4-step progressive wizard form.

import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaUser,
  FaChild,
  FaClipboardList,
} from "react-icons/fa";
import programData from "../Utils/programData";
import "../Css/Register.css";
import { validateStep } from "../helper/validateStep";

export default function Register() {
  const [step, setStep] = useState(1);
  const [openCourseDropdown, setOpenCourseDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState({
    field: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    childName: "",
    ageGroup: "",
    gradeGroup: "",
    gender: "",
    course: "",
    preferredTime: "",
    deviceType: "",
    internetQuality: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
    heardFrom: "",
    consent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleNext = () => {
    const newError = validateStep(step, formData);
    if (newError) {
      setError(newError); // show error
      console.error(newError);
      return; // stop moving to next step
    }
    setError({ field: "", message: "" }); // clear error if no issues
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) return alert("You must agree to the terms.");
    console.log(formData.data);
    setShowModal(true);
  };

  return (
    <div className="wizard-container">
      <h1 className="wizard-title">Course Registration Wizard</h1>

      {/* PROGRESS INDICATOR */}
      <div className="wizard-progress">
        <div className={`step-circle ${step >= 1 ? "active" : ""}`}>
          <FaUser />
        </div>
        <div className="line" />
        <div className={`step-circle ${step >= 2 ? "active" : ""}`}>
          <FaChild />
        </div>
        <div className="line" />
        <div className={`step-circle ${step >= 3 ? "active" : ""}`}>
          <FaClipboardList />
        </div>
        <div className="line" />
        <div className={`step-circle ${step === 4 ? "active" : ""}`}>
          <FaCheck />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="wizard-form">
        {/* ================= STEP 1: PARENT DETAILS ================ */}
        {step === 1 && (
          <div className="wizard-card fade-in">
            <h2>Parent / Guardian Details</h2>

            {/* Parent Name */}
            <div className="input-container">
              <input
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className={error.field === "parentName" ? "error-border" : ""}
                required
              />
              <div className="labelline">Enter Your Name</div>
            </div>
            {error.field === "parentName" && (
              <p className="error-message">{error.message}</p>
            )}

            {/* Phone Number */}
            <div
              className="phone-wrapper"
              style={{ marginBottom: "20px", zIndex: "3" }}
            >
              <PhoneInput
                country={"ke"}
                value={formData.parentPhone}
                onChange={(phone) =>
                  setFormData({ ...formData, parentPhone: phone })
                }
                inputProps={{
                  name: "parentPhone",
                  required: true,
                  title: "Enter Mobile Phone Number",
                }}
                inputStyle={{
                  width: "100%",
                  padding: "12px 50px",
                  borderRadius: "10px",
                  border:
                    error.field === "parentPhone"
                      ? "1px solid red"
                      : "1px solid #cfd8e1",
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            </div>

            {error.field === "parentPhone" && (
              <p className="error-message">{error.message}</p>
            )}

            {/* Parent Email */}
            <div className="input-container">
              <input
                name="parentEmail"
                type="text"
                value={formData.parentEmail}
                onChange={handleChange}
                className={error.field === "parentEmail" ? "error-border" : ""}
                required
              />
              <div className="labelline">Parent Email</div>
            </div>
            {error.field === "parentEmail" && (
              <p className="error-message">{error.message}</p>
            )}
          </div>
        )}

        {/* ================= STEP 2: CHILD DETAILS ================ */}
        {step === 2 && (
          <div className="wizard-card fade-in">
            <h2>Child's Details</h2>
            {/* Child Full Name */}
            <div className="input-container">
              <input
                name="childName"
                value={formData.childName}
                onChange={handleChange}
                className={error.field === "childName" ? "error-border" : ""}
                required
              />
              <div className="labelline">Child's Full Name</div>
            </div>

            {error.field === "childName" && (
              <p className="error-message">{error.message}</p>
            )}

            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className={error.field === "ageGroup" ? "error-border" : ""}
              required
            >
              <option value="">Select Age Group</option>
              <option value="4-6 years">4–6 years</option>
              <option value="7-9 years">7–9 years</option>
              <option value="10-13 years">10–13 years</option>
              <option value="14-17 years">14–17 years</option>
            </select>
            {error.field === "ageGroup" && (
              <p className="error-message">{error.message}</p>
            )}

            <select
              name="gradeGroup"
              value={formData.gradeGroup}
              onChange={handleChange}
              className={error.field === "gradeGroup" ? "error-border" : ""}
              required
            >
              <option value="">Select Grade Group</option>
              <option value="1-3">Grades 1–3</option>
              <option value="4-6">Grades 4–6</option>
              <option value="7-9">Grades 7–9</option>
            </select>
            {error.field === "gradeGroup" && (
              <p className="error-message">{error.message}</p>
            )}

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={error.field === "gender" ? "error-border" : ""}
              required
            >
              <option value="">Gender</option>
              <option value="Male">Boy</option>
              <option value="Female">Girl</option>
              <option value="notSay">Prefer Not Say</option>
            </select>
            {error.field === "gender" && (
              <p className="error-message">{error.message}</p>
            )}

            {/* Custom Course Dropdown */}
            <div className="custom-select">
              <div
                className={`selected-option ${
                  error.field === "course" ? "error-border" : ""
                }`}
                onClick={() => setOpenCourseDropdown(!openCourseDropdown)}
              >
                {formData.course || "Select Course"}
              </div>

              {openCourseDropdown && (
                <div className="options-list">
                  {programData.flatMap((cat) =>
                    cat.items.map((item) => (
                      <div
                        key={item.title}
                        className="option"
                        onClick={() => {
                          setFormData({ ...formData, course: item.title });
                          setOpenCourseDropdown(false);
                        }}
                      >
                        {item.title} ({cat.category})
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {error.field === "course" && (
              <p className="error-message">{error.message}</p>
            )}
          </div>
        )}

        {/* ================= STEP 3: CLASS PREFERENCES ================ */}
        {step === 3 && (
          <div className="wizard-card fade-in">
            <h2>Class Preferences</h2>

            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className={error.field === "preferredTime" ? "error-border" : ""}
              required
            >
              <option value="">Preferred Class Time</option>
              <option value="Morning">Morning (10am - 12pm)</option>
              <option value="Afternoon">Afternoon (2pm - 4pm)</option>
            </select>
            {error.field === "preferredTime" && (
              <p className="error-message">{error.message}</p>
            )}

            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={handleChange}
              className={error.field === "deviceType" ? "error-border" : ""}
              required
            >
              <option value="">Child's Device</option>
              <option value="Laptop">Laptop</option>
              <option value="Tablet">Tablet</option>
              <option value="Desktop">Desktop</option>
            </select>
            {error.field === "deviceType" && (
              <p className="error-message">{error.message}</p>
            )}

            <select
              name="internetQuality"
              value={formData.internetQuality}
              onChange={handleChange}
              className={
                error.field === "internetQuality" ? "error-border" : ""
              }
              required
            >
              <option value="">Internet Quality</option>
              <option value="Strong">Strong</option>
              <option value="Moderate">Moderate</option>
              <option value="Unstable">Unstable</option>
            </select>
            {error.field === "internetQuality" && (
              <p className="error-message">{error.message}</p>
            )}

            <h3 className="emergency-header">Emergency Contact</h3>

            <div className="input-container">
              <input
                name="emergencyContact"
                placeholder="Emergency Contact Name"
                value={formData.emergencyContact}
                onChange={handleChange}
                className={
                  error.field === "emergencyContact" ? "error-border" : ""
                }
                required
              />
              <div className="labelline">Emergency Contact Name</div>
            </div>

            {error.field === "emergencyContact" && (
              <p className="error-message">{error.message}</p>
            )}

            <div
              className="phone-wrapper"
              style={{ marginBottom: "20px", zIndex: "3" }}
            >
              <PhoneInput
                country={"ke"}
                value={formData.emergencyPhone}
                onChange={(phone) =>
                  setFormData({ ...formData, emergencyPhone: phone })
                }
                inputProps={{
                  name: "emergencyPhone",
                  required: true,
                  title: "Enter Mobile Phone Number",
                }}
                inputStyle={{
                  width: "100%",
                  padding: "12px 50px",
                  borderRadius: "10px",
                  border:
                    error.field === "emergencyPhone"
                      ? "1px solid red"
                      : "1px solid #cfd8e1",
                }}
              />
            </div>

            {error.field === "emergencyPhone" && (
              <p className="error-message">{error.message}</p>
            )}

            <textarea
              name="notes"
              placeholder="Any notes about your child? (optional)"
              value={formData.notes}
              onChange={handleChange}
            />

            <select
              name="heardFrom"
              value={formData.heardFrom}
              onChange={handleChange}
              className={error.field === "heardFrom" ? "error-border" : ""}
              required
            >
              <option value="">How did you hear about us?</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Referral">Friend / Referral</option>
              <option value="School">School</option>
            </select>
            {error.field === "heardFrom" && (
              <p className="error-message">{error.message}</p>
            )}
          </div>
        )}

        {/* ================= STEP 4: CONSENT ================ */}
        {step === 4 && (
          <div className="wizard-card fade-in">
            <h2>Program Consent & Agreement</h2>
            <p className="consent-box">
              By submitting this form, I agree that:
              <br />
              • My child will attend sessions consistently.
              <br />
              • I have arranged a suitable device and internet.
              <br />
              • I consent to online classes via Google Meet.
              <br />• I agree to pay the program fee.
            </p>

            <label className="checkbox-container">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                required
              />
              I agree to the terms and conditions
            </label>

            <button className="submit-btn" type="submit">
              Proceed to Payment
            </button>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="wizard-nav">
          {step > 1 && (
            <button type="button" className="back-btn" onClick={handleBack}>
              <FaArrowLeft /> Back
            </button>
          )}

          {step < 4 && (
            <button type="button" className="next-btn" onClick={handleNext}>
              Next <FaArrowRight />
            </button>
          )}
        </div>
      </form>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Select Payment Method</h2>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <button className="payment-option">Mpesa</button>
          </div>
        </div>
      )}
    </div>
  );
}
