import React, { useState } from "react";
import "../../Css/AuthLayout.css";
import Login from "../Login";
import SignIn from "../SignIn";
const AuthLayout = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const toggleAuth = () =>{
    console.log("Togglingflip state...")
    setIsFlipped((prev)=>!prev)
  };
  return (
    <div className="authlayout_container">
      <div className={`wrapper_container ${isFlipped ? "is-flipped" : ""}`}>
        {/* Face 1: Front */}
        <div className="auth-face login-face">
          <Login onToggle={toggleAuth} />
        </div>

        {/* Face 2: Back */}
        <div className="auth-face signin-face">
          <SignIn onToggle={toggleAuth} />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
