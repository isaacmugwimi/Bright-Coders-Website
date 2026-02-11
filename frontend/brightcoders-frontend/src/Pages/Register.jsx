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
  const [depositPaid, setDepositPaid] = useState("");
  // Payment Selection States
  const [paymentMode, setPaymentMode] = useState("full"); // "full" or "deposit"
  const DEPOSIT_AMOUNT = "Any amount"; // Define your fixed deposit amount here
  const [paymentStep, setPaymentStep] = useState(1); // 1 = Choice, 2 = Instructions
  const [shake, setShake] = useState(false);
  const formTopRef = React.useRef(null);
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

  // FETCH ALL COURSES AND INITIALIZE STATE
  useEffect(() => {
    const fetchAndInitialize = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/live`
        );
        const courses = response.data;
        setDbCourses(courses);

        // Handle pre-selected course from navigation state
        if (location.state?.selectedCourse) {
          setFormData((prev) => ({
            ...prev,
            course: location.state.selectedCourse,
          }));

          if (location.state.price) {
            setCoursePrice(location.state.price);
          } else {
            // Find price in fetched data if not in location state
            const matched = courses.find(
              (c) => c.title === location.state.selectedCourse
            );
            if (matched) setCoursePrice(matched.price);
          }
        }
      } catch (error) {
        console.error("Error while fetching data from the Database: ", error);
      }
    };
    fetchAndInitialize();
  }, [location.state]); // Refetch/Re-sync if location state changes

  useEffect(() => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  // Update course price when user selects a different course manually
  useEffect(() => {
    if (dbCourses.length > 0 && formData.course) {
      const selected = dbCourses.find((c) => c.title === formData.course);
      if (selected) {
        setCoursePrice(selected.price);
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
    console.log(formData);
    setShowModal(true);
  };

  const handleRegistrationSubmit = async (method) => {
    setIsLoading(true);

    const numericCoursePrice =
      Number((coursePrice || "0").toString().replace(/[^0-9.-]+/g, "")) || 0;

    let finalCode = mpesaCode;
    let amountToPay = 0;
    let currentPaymentPlan = paymentMode;

    if (method === "Pay Later") {
      finalCode = "PAY_LATER";
      amountToPay = 0;
      currentPaymentPlan = "pay_later";
    } else {
      const rawDeposit = depositPaid
        ? depositPaid.toString().replace(/[^0-9.-]+/g, "")
        : "0";

      amountToPay =
        paymentMode === "full" ? numericCoursePrice : Number(rawDeposit);
    }

    console.log("Payload being sent:", {
      course: formData.course,
      total: numericCoursePrice,
      paid: amountToPay,
      plan: currentPaymentPlan,
    });

    const submissionData = {
      ...formData,
      mpesaCode: finalCode,
      paymentPlan: currentPaymentPlan,
      amountPaid: amountToPay,
      totalCoursePrice: numericCoursePrice,
    };

    console.group("📦 FINAL REGISTRATION PAYLOAD");
Object.entries(submissionData).forEach(([key, value]) => {
  console.log(`${key}:`, value, typeof value);
});
console.groupEnd();


    console.log(
  "🚀 Sending to backend:",
  JSON.stringify(submissionData, null, 2)
);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/registration`,
        submissionData
      );

      if (response.status === 201 || response.status === 200) {
        setMpesaCode(finalCode);
        setFormData((prev) => ({
          ...prev,
          regNumber: response.data.registration_number,
        }));
        setIsLoading(false);
        setShowModal(false);
        setIsFinished(true);
      }
    } catch (error) {
      setIsLoading(false);
      alert(
        error.response?.data?.message ||
          "Submission failed. Please check your connection."
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("2055543405");
    alert("Number copied!");
  };

  return (
    <div className="wizard-container" ref={formTopRef}>
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
          <div className="wizard-progress">
            <div className={`step-circle ${step >= 1 ? "active" : ""}`}>
              <FaUser />
            </div>

            <div className={`line ${step >= 2 ? "line-active" : ""}`} />

            <div className={`step-circle ${step >= 2 ? "active" : ""}`}>
              <FaChild />
            </div>

            <div className={`line ${step >= 3 ? "line-active" : ""}`} />

            <div className={`step-circle ${step >= 3 ? "active" : ""}`}>
              <FaClipboardList />
            </div>

            <div className={`line ${step >= 4 ? "line-active" : ""}`} />

            <div className={`step-circle ${step >= 4 ? "active" : ""}`}>
              <FaCheck />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="wizard-form">
            {/* ================= STEP 1: PARENT DETAILS ================ */}
            {step === 1 && (
              <div className="wizard-card fade-in">
                <h2>Parent / Guardian Details</h2>
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
                      autoFocus: false,

                      title: "Enter Mobile Phone Number",
                    }}
                    inputStyle={{
                      width: "100%",
                      padding: "12px 50px",
                      borderRadius: "10px",
                      border:
                        error.field === "parentPhone" ||
                        (formData.parentPhone.length > 0 &&
                          formData.parentPhone.length < 12)
                          ? "1px solid red"
                          : "1px solid #cfd8e1",
                    }}
                    containerStyle={{ width: "100%" }}
                  />
                </div>
                {error.field === "parentPhone" && (
                  <p className="error-message">{error.message}</p>
                )}

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
                            key={item.id}
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
                    inputProps={{ name: "emergencyPhone", required: true }}
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
                  <br />• My child will attend sessions consistently.
                  <br />• I have arranged a suitable device and internet.
                  <br />• I consent to online classes via Google Meet.
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

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="modal-overlay1">
          <div className="modal-box1">
            {isLoading ? (
              <div className="loading-container modal-loader">
                <div className="spinner"></div>
                <p>Verifying your registration...</p>
              </div>
            ) : (
              <>
                <button
                  className="close-modal1"
                  onClick={() => {
                    setShowModal(false);
                    setPaymentStep(1);
                    setDepositPaid("");
                  }}
                >
                  ✕
                </button>
                {paymentStep === 1 ? (
                  <div className="step-container animate-fade-in">
                    <h2>Secure Your Spot</h2>
                    <p className="step-subtitle">
                      Select a payment plan to continue
                    </p>
                    <div className="choice-grid">
                      <button
                        className="choice-card"
                        onClick={() => {
                          setPaymentMode("full");
                          setPaymentStep(2);
                        }}
                      >
                        <div className="choice-info">
                          <span className="choice-title">Full Payment</span>
                          <span className="choice-amount">
                            Ksh{" "}
                            {Number(
                              (coursePrice || "0")
                                .toString()
                                .replace(/[^0-9.-]+/g, "")
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="choice-badge">Recommended</div>
                      </button>
                      <button
                        className="choice-card"
                        onClick={() => {
                          setPaymentMode("deposit");
                          setPaymentStep(2);
                        }}
                      >
                        <div className="choice-info">
                          <span className="choice-title">Lipa Mdogo Mdogo</span>
                          <span className="choice-amount">
                            Flexible Deposit
                          </span>
                        </div>
                        <div className="choice-badge">Deposit</div>
                      </button>
                      <div className="modal-divider1">
                        <span>OR</span>
                      </div>
                      <button
                        className="choice-card pay-later"
                        onClick={() => handleRegistrationSubmit("Pay Later")}
                      >
                        <div className="choice-info">
                          <span className="choice-title">
                            Registration Only
                          </span>
                          <span className="choice-amount">Pay Later</span>
                        </div>
                        <div className="choice-badge special">Reserve</div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-slide-up">
                    <button
                      className="back-btn changePlan"
                      onClick={() => {
                        setPaymentStep(1);
                        setDepositPaid("");
                      }}
                    >
                      ← <span>Change Plan</span>
                    </button>
                    <h2>M-Pesa Payment</h2>
                    <div
                      className="instruction-card"
                      style={{ marginBottom: "60px" }}
                    >
                      <p>
                        {paymentMode === "full"
                          ? "Send Full Amount to:"
                          : "Send your Deposit to:"}
                      </p>
                      <div className="copy-box">
                        <span>Pay Bill: 303030</span>
                        <span>Account: 2055543405</span>
                        <button type="button" onClick={handleCopy}>
                          <FaCopy /> Copy
                        </button>
                      </div>
                      <p className="small-text">
                        Recipient Name: <b>Floyed Muchiri</b>
                      </p>
                    </div>
                    <div className="payment-inputs">
                      {paymentMode === "deposit" && (
                        <div
                          className="input-group fade-in"
                          style={{ marginBottom: "45px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <label>Amount Paid (Ksh)</label>
                            <span
                              style={{
                                fontSize: "15px",
                                fontWeight: "bold",
                                color: "#2ecc71",
                              }}
                            >
                              Balance: Ksh{" "}
                              {(
                                Number(
                                  coursePrice
                                    .toString()
                                    .replace(/[^0-9.-]+/g, "")
                                ) - (Number(depositPaid) || 0)
                              ).toLocaleString()}
                            </span>
                          </div>

                          <input
                            type="number"
                            // Added dynamic shake class here
                            className={`mpesa-code-input ${
                              shake ? "shake-input" : ""
                            }`}
                            placeholder="Enter amount sent"
                            min="1"
                            max={Number(
                              (coursePrice || "0")
                                .toString()
                                .replace(/[^0-9.-]+/g, "")
                            )}
                            value={depositPaid}
                            onKeyDown={(e) =>
                              ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault()
                            }
                            onChange={(e) => {
                              const maxLimit = Number(
                                (coursePrice || "0")
                                  .toString()
                                  .replace(/[^0-9.-]+/g, "")
                              );
                              const val = e.target.value;

                              // Allow clear/backspace
                              if (val === "") {
                                setDepositPaid("");
                                return;
                              }

                              const numericVal = Number(val);

                              // TRIGGER SHAKE: If zero, negative, or over max
                              if (numericVal <= 0 || numericVal > maxLimit) {
                                setShake(true);
                                setTimeout(() => setShake(false), 300); // Reset after animation

                                if (numericVal > maxLimit) {
                                  setDepositPaid(maxLimit.toString()); // Snap to max
                                }
                                return; // Stop execution (prevents setting value to 0)
                              }

                              setDepositPaid(val);
                            }}
                            required
                          />
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#666",
                              marginTop: "5px",
                              marginBottom: "20px",
                            }}
                          >
                            Enter any amount between 1 and{" "}
                            {Number(
                              (coursePrice || "0")
                                .toString()
                                .replace(/[^0-9.-]+/g, "")
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}

                      <div className="input-group">
                        <label>M-Pesa Transaction Code</label>
                        <input
                          type="text"
                          className="mpesa-code-input"
                          placeholder="e.g. SFG7H92J..."
                          value={mpesaCode}
                          onChange={(e) =>
                            setMpesaCode(e.target.value.toUpperCase())
                          }
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <button
                      className="confirm-btn"
                      disabled={
                        mpesaCode.length !== 10 ||
                        (paymentMode === "deposit" &&
                          (Number(depositPaid) <= 0 || !depositPaid))
                      }
                      onClick={() => handleRegistrationSubmit("M-Pesa")}
                    >
                      Confirm Registration
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
