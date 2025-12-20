import React, { useContext, useState } from "react";
import { SiGoogle, SiFacebook, SiGithub, SiLinkedin } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Login.css";
import UserContext from "../Components/Context/UserContext";
import PopupScreen from "./AuthLayout/PopupScreen";
import axiosInstance from "../utils/axiosInsatance";
import { API_PATHS } from "../utils/apiPaths";
const Login = ({ onToggle }) => {
  // added the states for  form data and errors
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [error, setError] = useState({
    field: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError({ field: "", message: "" }); // Reset error message
    const { email, password } = formData;
    // ========================================
    // 🔹 login api call
    // ========================================
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      // Backend returns: { message, user, token }
      const { token, user } = response.data;

      if (token) {
        // Save token and update global user state
        localStorage.setItem("token", token);
        updateUser(user);
        //  Redirect to home
        navigate("/home");
      }
    } catch (err) {
      // Get the message from the backend
      const backendMsg = err.response?.data?.message || "Something went wrong.";

      // If it's a login failure (wrong email or password)
      if (
        err.response?.status === 401 ||
        backendMsg.toLowerCase().includes("password") ||
        backendMsg.toLowerCase().includes("invalid")
      ) {
        setError({
          field: "both", // We use a keyword to trigger both borders
          message: backendMsg,
        });
      } else {
        setError({ field: "general", message: backendMsg });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  return (
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
          <p>or use your email and password</p>
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
        <button type="submit">Login In</button>
      </form>
      <PopupScreen onToggle={onToggle} />
    </div>
  );
};

export default Login;
