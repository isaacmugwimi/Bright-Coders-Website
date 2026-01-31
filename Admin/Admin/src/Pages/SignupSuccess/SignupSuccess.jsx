import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SignupSuccess.css";

const SignupSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-success-container">
      <div className="signup-success-card animate-fade-in">
        <CheckCircle size={64} color="#22c55e" />
        <h2>Account Created Successfully 🎉</h2>
        <p>
          Your account has been created.  
          Please log in to continue.
        </p>

        <button
          className="signup-success-btn"
          onClick={() => navigate("/authentication")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SignupSuccess;
