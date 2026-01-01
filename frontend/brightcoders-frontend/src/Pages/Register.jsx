// Multi-Step Registration Form (React + External CSS)
// This file uses a 4-step progressive wizard form.

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaUser,
  FaChild,
  FaClipboardList,
  FaCopy,
} from "react-icons/fa";
// import programData from "../Utils/programData";
import "../Css/Register.css";
import { validateStep } from "../helper/validateStep";
import axios from "axios";
import SuccessScreen from "../Components/SuccessScreen/SuccessScreen";

export default function Register() {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [openCourseDropdown, setOpenCourseDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dbCourses, setDbCourses] = useState([]);
  const [mpesaCode, setMpesaCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coursePrice, setCoursePrice] = useState("5,000");
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
  // FETCH ALL COURSES FOR THE DROPDOWN ON MOUNT
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/courses/live"
        );

        setDbCourses(response.data);
      } catch (error) {
        console.error("Error while fetching data from the Database: ", error);
      }
    };
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (location.state?.selectedCourse) {
      setFormData((prev) => ({
        ...prev,
        course: location.state.selectedCourse,
      }));
      if (location.state.price) setCoursePrice(location.state.price);
    }
  }, [location.state]);

  useEffect(() => {
    // Update course price when course changes
    if (dbCourses && dbCourses.length > 0) {
      console.log("Processing courses from flat list...");
      const allCourses = dbCourses;
      if (formData.course) {
        const selected = allCourses.find((c) => c.title === formData.course);
        if (selected) {
          setCoursePrice(selected.price);
        }
      }
    }
  }, [formData.course, dbCourses]);

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
    console.log(formData); // Fixed to access formData directly
    setShowModal(true);
  };

  // const handleRegistrationSubmit = async (paymentType) => {
  //   setIsLoading(true);
  //   setShowModal(false);

  //   const submissionData = {
  //     ...formData,
  //     paymentMethod: paymentType,
  //     // If it's Pay Later, we send a placeholder code
  //     mpesaCode: paymentType === "Pay Later" ? "PAY_LATER" : mpesaCode,
  //   };

  //   try {
  //     const response = await fetch("http://localhost:5000/api/register", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(submissionData),
  //     });

  //     if (response.ok) {
  //       setIsLoading(false);
  //       setIsFinished(true);
  //     } else {
  //       setIsLoading(false);
  //       alert("Submission failed. Please check your connection.");
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.error("Error:", error);
  //   }
  // };

  // Helper for copying number

  const handleRegistrationSubmit = async (paymentType) => {
    setIsLoading(true);
    setShowModal(false);
    if(paymentType==="Pay Later"){
      setMpesaCode("PAY_LATER")
    }

    // SIMULATION: Instead of fetching, we just wait 2 seconds
    setTimeout(() => {
      setIsLoading(false);
      setIsFinished(true);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("0712345678");
    alert("Number copied!");
  };

  return (
    <div className="wizard-container">
      <h1 className="wizard-title">Course Registration Wizard</h1>

      {isLoading ? (
        <div className="loading-container fade-in">
          <div className="spinner"></div>
          <p>Verifying your registration...</p>
        </div>
      ) : isFinished ? (
        <SuccessScreen
          formData={formData}
          mpesaCode={mpesaCode}
          isPayLater={mpesaCode === "PAY_LATER"}
        />
      ) : (
        <>
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
                    className={
                      error.field === "parentName" ? "error-border" : ""
                    }
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
                    className={
                      error.field === "parentEmail" ? "error-border" : ""
                    }
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
                    className={
                      error.field === "childName" ? "error-border" : ""
                    }
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
                      {dbCourses.length > 0 ? (
                        dbCourses.map((item) => (
                          <div
                            key={item.id} // Using 'id' from your console log
                            className="option"
                            onClick={() => {
                              setFormData({ ...formData, course: item.title });
                              setCoursePrice(item.price);
                              setOpenCourseDropdown(false);
                            }}
                          >
                            {item.title} ({item.category})
                          </div>
                        ))
                      ) : (
                        <div className="option disabled">
                          Loading programs...
                        </div>
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
                  className={
                    error.field === "preferredTime" ? "error-border" : ""
                  }
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
        </>
      )}

      {/* PAYMENT MODAL - STYLED FOR MPESA */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <h2>Complete Payment</h2>

            <div className="instruction-card">
              <p>
                1. Send <b>KES {coursePrice}</b> to:
              </p>
              <div className="copy-box">
                <span>0712345678</span>
                <button type="button" onClick={handleCopy}>
                  <FaCopy /> Copy
                </button>
              </div>
              <p>2. Enter Transaction Code below:</p>
            </div>

            <input
              type="text"
              className="mpesa-code-input"
              placeholder="TRANS CODE (e.g. SFD5...)"
              value={mpesaCode}
              onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
            />

            <div className="modal-divider">
              <span>OR</span>
            </div>

            <button
              className="pay-later-btn"
              onClick={() => handleRegistrationSubmit("Pay Later")}
            >
              Request to Pay Later
            </button>

            <button
              className="payment-option"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={() => {
                console.log("Final Data:", { ...formData, mpesaCode });
                // After successful backend response:
                const mpesaRegex = /^[A-Z0-9]{10}$/;

                if (!mpesaRegex.test(mpesaCode)) {
                  alert("Please enter a valid M-Pesa transaction code.");
                }
                handleRegistrationSubmit("M-Pesa");
              }}
            >
              {isLoading ? "Processing..." : "Confirm Registration"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
