import React, { useContext, useState, useEffect } from "react";
import { SiGoogle, SiFacebook, SiGithub, SiLinkedin } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Login.css";
import UserContext from "../Components/Context/UserContext";
import PopupScreen from "./AuthLayout/PopupScreen";
import OTPVerify from "./AuthLayout/OTPVerify";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { fetchCsrfToken } from "../utils/csrf";
import ForgotPassword from "./ForgotPassword/ForgotPassword";

const Login = ({ onToggle }) => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  // States
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [resendAvailableIn, setResendAvailableIn] = useState(60);
const [showForgot, setShowForgot] = useState(false);

  const [error, setError] = useState({ field: "", message: "" });
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Load temp 2FA token if user refreshes
  useEffect(() => {
    const savedTempToken = sessionStorage.getItem("2fa_temp");
    if (savedTempToken) {
      setTempToken(savedTempToken);
      setRequires2FA(true);
    }
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError({ field: "", message: "" });

    const { email, password } = formData;

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        { email, password },
        { withCredentials: true },
      );

      const data = response.data;

      // 2FA required
      if (data.twoFactorRequired) {
        setRequires2FA(true);
        setTempToken(data.tempToken);
        sessionStorage.setItem("2fa_temp", data.tempToken);
        setResendAvailableIn(data.resendAvailableIn || 60);
        // await fetchCsrfToken();
      } else {
        // 1. Fetch the token FIRST
        await fetchCsrfToken();
        // Successful login, cookie handles token automatically
        updateUser(data.user);
        navigate("/home");
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message || "Something went wrong.";
      setError({ field: "general", message: backendMsg });
    } finally {
      setLoading(false);
    }
  };

  // 2FA screen
  if (requires2FA) {
    return (
      <OTPVerify
        tempToken={tempToken}
        onSuccess={(token, user) => {
          sessionStorage.removeItem("2fa_temp"); // cleanup
          // no need to store token manually
          updateUser(user);
          navigate("/home");
        }}
        onCancel={() => {
          setRequires2FA(false);
          setTempToken("");
          sessionStorage.removeItem("2fa_temp");
        }}
        initialResendAvailableIn={resendAvailableIn}
      />
    );
  }

  // Main login form
  return (
    <>
        <div className="login_page">
      <form onSubmit={handleLogin}>
        <div className="login_title">
          <h2>Login In</h2>
        </div>

        <div className="login_social_icons">
          <div className="social-icon">
            <SiGoogle size={24} />
          </div>
          <div className="social-icon">
            <SiFacebook size={24} />
          </div>
          <div className="social-icon">
            <SiGithub size={24} />
          </div>
          <div className="social-icon">
            <SiLinkedin size={24} />
          </div>
        </div>

        <div className="alternative">
          <p style={{ fontSize: "1rem" }}>or use your email and password</p>
        </div>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          placeholder="Enter email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`inputs ${error.field === "email" || error.field === "both" ? "error-border" : ""}`}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`inputs ${error.field === "password" || error.field === "both" ? "error-border" : ""}`}
        />

        {error.message && (
          <p
            className="error-paragraph"
            style={{ color: "red", textAlign: "center" }}
          >
            {error.message}
          </p>
        )}

        <p

role="button" 
 tabIndex={0}

  className="forgot-link"
  onClick={() => setShowForgot(true)}
>
  Forget Your Password?
</p>


        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Login In"}
        </button>
      </form>

      <PopupScreen onToggle={onToggle} />
    </div>

    {showForgot && (
  <ForgotPassword onClose={() => setShowForgot(false)} />
)}
    
    </>


  );
};

export default Login;
