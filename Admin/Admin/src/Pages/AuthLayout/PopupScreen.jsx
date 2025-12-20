import React from "react";
import "../../Css/PopupScreen.css";
import logo from "../../assets/logo2.png";

const PopupScreen = ({ onToggle }) => {
  return (
    <div className="popup-section">
      <div className="logo-section">
        <img src={logo} alt="" />
      </div>
      <h1>Hello, Friend?</h1>
      <p>Register with your personal details to use all site features</p>
      <button
        onClick={() => {
          console.log("Button clicked!");
          onToggle();
        }}
      >
        Sign Up
      </button>
    </div>
  );
};

export default PopupScreen;
