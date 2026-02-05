import { useState, useRef, useEffect } from "react";
import "./OTPVerify.css";
import { fetchCsrfToken } from "../../utils/csrf";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

export default function OTPVerify({
  tempToken,
  onSuccess,
  onCancel,
  initialResendAvailableIn,
}) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(
    initialResendAvailableIn,
  );
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Auto-focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle countdown for resend button
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

  /* =========================
     Paste Handling Logic
  ========================= */
  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();

    // Check if the pasted content is numeric
    if (!/^\d+$/.test(data)) return;

    const pasteData = data.slice(0, 6).split("");
    const newOtp = [...otp];

    pasteData.forEach((char, index) => {
      newOtp[index] = char;
    });

    setOtp(newOtp);

    // Focus the next logical input
    const lastFilledIndex = Math.min(pasteData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  /* =========================
     Input Change Logic
  ========================= */
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Numeric only

    const newOtp = [...otp];
    // Take the last character (handles browser autofill and manual typing)
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input if digit entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      return setError("Please enter all 6 digits.");
    }

    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.post(
        API_PATHS.AUTH.VERIFY_OTP,
        { otp: otpCode },
        {
          headers: { Authorization: `Bearer ${tempToken}` },
        },
      );

      await fetchCsrfToken();
      onSuccess(res.data.token, res.data.user);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) setError("Invalid or expired OTP.");
      else if (status === 429)
        setError("Too many attempts. Please login again.");
      else setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError("");
      setCanResend(false);
      setOtp(Array(6).fill(""));

      const res = await axiosInstance.post(
        `${API_PATHS.AUTH}/resend-otp`,
        {},
        { headers: { Authorization: `Bearer ${tempToken}` } },
      );

      setResendCooldown(res.data.resendAvailableIn || 90);
      setError("A fresh code has been sent to your email.");
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Please wait before requesting another OTP.",
      );
      setCanResend(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Verify Account</h2>
        <p>A 6-digit verification code was sent to your email address.</p>

        <div className="otp-inputs-row">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric" // Opens number pad on mobile
              autoComplete="one-time-code" // Suggests code from SMS/Email on mobile
              pattern="\d*"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onPaste={handlePaste}
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
              className="otp-resend-link"
              disabled={loading}
            >
              Resend Code
            </button>
          ) : (
            <p>
              Resend code in <span>{resendCooldown}s</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
