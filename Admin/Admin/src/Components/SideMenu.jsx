import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Css/SideMenu.css";
import UserContext from "../Components/Context/UserContext.jsx";
import { motion } from "framer-motion";
import { SIDE_MENU_DATA } from "../sideMenuData.js";

const SideMenu = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const lastUpdated = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleClick = (path) => {
    if (path === "logout") {
      localStorage.removeItem("token");
      // window.location.href = "/authentication";
    } else navigate(path);
  };

  // Helper to determine if we should show the image
  const hasValidImage =
    user?.profile_image_url && user.profile_image_url.includes("http");

  return (
    <div className="main-side-bar">
      <div className="profile-pic-menu">
        <div className="image-container">
          {hasValidImage ? (
            <img
              src={user.profile_image_url}
              alt={user?.full_name || "Profile"}
              className="profile-img"
              crossOrigin="anonymous"
              onError={(e) => {
                // If image fails to load, hide it and show placeholder logic
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="profile-img-placeholder">
              {user?.full_name?.charAt(0) || "U"}
            </div>
          )}

          <motion.span
            className="status-dot"
            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="profile-text-info">
          <h5 className="profile-pic-name">
            Hello {user?.full_name || "Guest"}
          </h5>
          <p className="last-active">Active: {lastUpdated}</p>
        </div>
      </div>
      <div className="side-menu-section">
        {SIDE_MENU_DATA.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`side-menu-buttons ${
                location.pathname === item.path ? "active-menu" : null
              }`}
            >
              <IconComponent size={20} />
              {item.label}
            </button>
          );
        })}

        {/* <button className="logout-btn">
          <LogOut size={20} color="#ef4444" /> 
          <span>Logout</span>
        </button> */}
      </div>
    </div>
  );
};

export default SideMenu;
