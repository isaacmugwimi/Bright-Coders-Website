import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PopupScreen2 from "./AuthLayout/PopupScreen2";
import "../Css/SignIn.css";

// image imports
import user_pic from "../assets/user.svg";
import upload from "../assets/upload.svg";
import delete_icon from "../assets/trash-2.svg";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths";
import { validateEmail, validateName, validatePassword } from "../utils/helper";
import UserContext from "../Components/Context/UserContext";
import uploadImage from "../utils/uploadImage";

const SignIn = ({ onToggle }) => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    field: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });



  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file); // store actual file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result); // base64 string for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setError({ field: "", message: "" }); // Reset error at start
  
    const { fullName, email, password } = formData;

    // form validation
    const nameResults = validateName(fullName);
    if (nameResults !== true) {
      setError({ field: "fullName", message: nameResults });
      return;
    }

    // validate email
    const emailResults = validateEmail(email);
    if (emailResults !== true) {
      let errorMessage = "Please enter a valid email address";
      console.error(errorMessage);
      setError({ field: "email", message: errorMessage });
      return;
    }

    // validate password
    const passwordResult = validatePassword(password);
    if (passwordResult !== true) {
      console.error(passwordResult);
      setError({ field: "password", message: passwordResult });
      return;
    }

    // ========================================
    // 🔹 Sign up api call
    // ========================================
    try {
      setLoading(true);
     

      // Register User
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        // profileImageUrl,
        
        
      });

      // Backend returns: { newUser, token, message, id }
      // const {  newUser } = response.data;
     
        // updateUser(newUser);
        setFormData({ fullName: "", email: "", password: "" });
        navigate("/signup-success");

     
    } catch (error) {
      // 1. Extract the message regardless of where it came from (Axios or Upload Util)
      const backendMsg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      const lowMsg = backendMsg.toLowerCase();

      // 2. Now run your mapping logic on that message
      if (lowMsg.includes("email")) {
        setError({ field: "email", message: backendMsg });
      } else if (lowMsg.includes("password")) {
        setError({ field: "password", message: backendMsg });
      } else if (
        lowMsg.includes("upload") ||
        lowMsg.includes("enoent") ||
        lowMsg.includes("directory")
      ) {
        // This will now catch that "C:\Users\Isaac..." error!
        console.log("Image/Upload Error Caught: ", backendMsg);
        setError({
          field: "profileImageUrl",
          message: "Image upload failed. Please try again.",
        });
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

  return (
    <div className="sign-up-page">
      <PopupScreen2 onToggle={onToggle} />
      {/* Container for the right Side (Form) */}
      <div className="form-container-left">
        <form onSubmit={handleSignUp}>
          <h3>
            <strong>Create an Account</strong>
          </h3>
          <p className="signIn-p">
            Join us today by entering your details below.
          </p>
          

          <div className="form-row">
            <div className="form-group">
              <label className="label" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="e.g John Doe"
                className={`inputs ${
                  error.field === "fullName" ? "error-border" : ""
                }`}
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="signInEmail">
                Email Address
              </label>
              <input
                id="signInEmail"
                type="email"
                placeholder="johndoe@gmail.com"
                name="email"
                className={`inputs ${
                  error.field === "email" ? "error-border" : ""
                }`}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Min 8 Characters"
            name="password"
            //required
            className={`inputs ${
              error.field === "password" ? "error-border" : ""
            }`}
            onChange={handleChange}
            value={formData.password}
          />
          {error.message && (
            <div style={{ height: "20px" }}>
              <p className="error-paragraph">{error.message}</p>
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Sign Up"}
          </button>

          <p>
            Already have an account?{" "}
            <span
              onClick={onToggle}
              style={{ cursor: "pointer", color: "darkcyan" }}
            >
              {" "}
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
