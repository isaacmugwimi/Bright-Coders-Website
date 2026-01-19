import { useState, useRef, useEffect } from "react";
import "./OTPVerify.css";
import axios from "axios";

export default function OTPVerify({ tempToken, onSuccess, onCancel,initialResendAvailableIn }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Resend OTP state
 const [resendCooldown, setResendCooldown] = useState(
  initialResendAvailableIn
);

  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  /* -------------------- */
  /* Focus first input */
  /* -------------------- */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* -------------------- */
  /* Resend countdown */
  /* -------------------- */
  useEffect(() => {
    if (!canResend && resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (resendCooldown === 0) {
      setCanResend(true);
    }
  }, [resendCooldown, canResend]);

  /* -------------------- */
  /* OTP input handling */
  /* -------------------- */
  const handleChange = (e, index) => {
    if (isNaN(e.target.value)) return;

    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* -------------------- */
  /* Verify OTP */
  /* -------------------- */
  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return setError("Please enter all 6 digits.");
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:8000/api/auth/verify-otp",
        { otp: otpCode },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        },
      );

      onSuccess(res.data.token, res.data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid or expired OTP.");
      } else if (err.response?.status === 429) {
        setError("Too many attempts. Please login again.");
      } else {
        setError("Verification failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- */
  /* Resend OTP */
  /* -------------------- */
  const handleResendOTP = async () => {
    try {
    setError("");
    setCanResend(false);
    setOtp(Array(6).fill(""));

    const res = await axios.post(
      "http://localhost:8000/api/auth/resend-otp",
      {},
      { headers: { Authorization: `Bearer ${tempToken}` } }
    );

    // <-- use backend cooldown
    setResendCooldown(res.data.resendAvailableIn || 90);

    setError("A new OTP has been sent to your email.");
  } catch (err) {
    setError(err.response?.data?.message || "Please wait before requesting another OTP.");
  }
  };

  /* -------------------- */
  /* UI */
  /* -------------------- */
  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Verify Account</h2>
        <p>Enter the 6-digit code sent to your email.</p>

        <div className="otp-inputs-row">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-digit-input"
              disabled={loading}
            />
          ))}
        </div>

        {error && <div className="otp-error-msg">{error}</div>}

        <div className="otp-actions">
          <button
            className="otp-cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="otp-verify-btn"
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </div>

        <div className="otp-resend">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              className="otp-resend-btn"
              disabled={loading}
            >
              Resend OTP
            </button>
          ) : (
            <span>Resend available in {resendCooldown}s</span>
          )}
        </div>
      </div>
    </div>
  );
}
