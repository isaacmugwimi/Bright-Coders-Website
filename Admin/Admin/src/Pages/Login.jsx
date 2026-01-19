import React, { useContext, useState } from "react";
import { SiGoogle, SiFacebook, SiGithub, SiLinkedin } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Login.css";
import UserContext from "../Components/Context/UserContext";
import PopupScreen from "./AuthLayout/PopupScreen";
import axiosInstance from "../utils/axiosInstance";

import { API_PATHS } from "../utils/apiPaths";
import OTPVerify from "./AuthLayout/OTPVerify";
import { useEffect } from "react";
const Login = ({ onToggle }) => {
  // added the states for  form data and errors
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [resendAvailableIn, setResendAvailableIn] = useState(60);

  const [error, setError] = useState({
    field: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const savedTempToken = sessionStorage.getItem("2fa_temp");
    if (savedTempToken) {
      setTempToken(savedTempToken);
      setRequires2FA(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError({ field: "", message: "" }); // Reset error message
    const { email, password } = formData;
    // ========================================
    // 🔹 login api call
    // ========================================
    try {
      setLoading(true);
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      // Backend returns: { message, user, token }
      const data = response.data;

      if (data.twoFactorRequired) {
        setFormData((prev) => ({ ...prev, password: "" }));
        setRequires2FA(true);
        setTempToken(data.tempToken);

        // ✅ Persist temp token for refresh safety
        sessionStorage.setItem("2fa_temp", data.tempToken);
        // 🔹 Set initial resend cooldown from backend
        setResendAvailableIn(data.resendAvailableIn );
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        updateUser(data.user);
        navigate("/home");
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message || "Something went wrong.";

      if (
        err.response?.status === 401 ||
        backendMsg.toLowerCase().includes("password") ||
        backendMsg.toLowerCase().includes("invalid")
      ) {
        setError({ field: "both", message: backendMsg });
      } else {
        setError({ field: "general", message: backendMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  if (requires2FA) {
    return (
      <OTPVerify
        tempToken={tempToken}
        onSuccess={(token, user) => {
          sessionStorage.removeItem("2fa_temp"); // ✅ cleanup
          localStorage.setItem("token", token);
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
            placeholder="enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`inputs ${
              error.field === "email" || error.field === "both"
                ? "error-border"
                : ""
            }`}
            //required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`inputs ${
              error.field === "password" || error.field === "both"
                ? "error-border"
                : ""
            }`} //required
          />
          {error.message && (
            <p
              className="error-paragraph"
              style={{ color: "red", textAlign: "center" }}
            >
              {error.message}
            </p>
          )}
          <Link to="#">Forget Your Password?</Link>
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Login In"}
          </button>
        </form>
        <PopupScreen onToggle={onToggle} />
      </div>
    </>
  );
};

export default Login;
