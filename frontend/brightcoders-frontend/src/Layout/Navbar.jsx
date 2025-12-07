import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo2.png";

// FontAwesome icons
import {
  FaHome,
  FaInfoCircle,
  FaUsers,
  FaEnvelope,
  FaUserPlus,
  FaUserTie, // Founder
  FaComments, // Testimonials
  FaBlog, // Blogs
  FaQuestionCircle, // FAQs
  FaImages, // Gallery
  FaStarHalfAlt, // Why Us
} from "react-icons/fa";

import { IoMdArrowDropdown } from "react-icons/io";

import "../Css/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-main-section">
      <div className="nav-logo">
        <img src={logo} alt="Website Logo" width={"125px"} height={"125px"} />
      </div>

      <div className="nav-links">
        <ul>
          <li >
            <NavLink  to="/home"  >
              <FaHome className="nav-icon" /> <span>Home</span>
            </NavLink >
          </li>

          <li>
            <NavLink  to="/programs">
              <FaUsers className="nav-icon" />
              <span>Programs</span>
            </NavLink >
          </li>

          <li>
            <NavLink  to="/about">
              <FaInfoCircle className="nav-icon" />
              <span>About Us</span>
            </NavLink >
          </li>

          {/* DROPDOWN */}
          <li className="dropdown">
            <div className="dropdown-link">
              <IoMdArrowDropdown className="nav-icon" />
              <span>More</span>
            </div>

            <div className="sub-menu">
              <ul>
                <li>
                  <NavLink  to="/founder">
                    <FaUserTie className="nav-icon" />
                    <span>Founder</span>
                  </NavLink >
                </li>

                <li>
                  <NavLink  to="/testimonials">
                    <FaComments className="nav-icon" />
                    <span>Testimonials</span>
                  </NavLink >
                </li>

                <li>
                  <NavLink >
                    <FaBlog className="nav-icon" />
                    <span>Blogs</span>
                  </NavLink >
                </li>

                <li>
                  <NavLink  to="/faqs">
                    <FaQuestionCircle className="nav-icon" />
                    <span>FAQs</span>
                  </NavLink >
                </li>

                <li>
                  <NavLink  to="/gallery">
                    <FaImages className="nav-icon" />
                    <span>Gallery</span>
                  </NavLink >
                </li>

                <li>
                  <NavLink  to="/why-us">
                    <FaStarHalfAlt className="nav-icon" />
                    <span>Why Choose Us</span>
                  </NavLink >
                </li>
              </ul>
            </div>
          </li>

          <li>
            <NavLink  to="/contact">
              <FaEnvelope className="nav-icon" />
              <span>Contact</span>
            </NavLink >
          </li>
        </ul>
      </div>

      <div className="nav-links-2">
        <ul>
          <li>
            <NavLink  to="/register">
              <FaUserPlus className="nav-icon" />
              <span>Register</span>
            </NavLink >
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
