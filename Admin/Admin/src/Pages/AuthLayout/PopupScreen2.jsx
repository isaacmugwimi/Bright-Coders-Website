import React from "react";
import "../../Css/PopupScreen.css";
import logo from "../../assets/logo2.png"
const PopupScreen2 = ({onToggle}) => {
  return (
    <div className="popup-section" style={{ borderRadius: "0 100px 100px 0" }}>
      <div className="logo-section">
        <img src={logo} alt=""   />
      </div>
      <h1>Hello, Friend?</h1>
      <p style={{color:"white"}}>Register with your personal details to use all site features</p>
      <button style={{border:"1px solid white"}} onClick={()=>{
        onToggle
      }}>Log In</button>
    </div>
  );
};

export default PopupScreen2;
