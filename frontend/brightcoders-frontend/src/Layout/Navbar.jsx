import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo2.png";
import { HashLink } from "react-router-hash-link";

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
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { IoMdArrowDropdown } from "react-icons/io";

import "../Css/Navbar.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return (
    <div className="navbar-main-section">
      <div className="nav-logo">
        <img src={logo} alt="Website Logo" width={"125px"} height={"125px"} />
      </div>

      <div className={`nav-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
        
        <div className="close-menu" onClick={toggleMobileMenu}>
          <FaTimes size={24} />
        </div>
        <ul>
          <li>
            <NavLink to="/home">
              <FaHome className="nav-icon"  /> <span>Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/programs">
              <FaUsers className="nav-icon" />
              <span>Programs</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/about">
              <FaInfoCircle className="nav-icon" />
              <span>About Us</span>
            </NavLink>
          </li>

          {/* DROPDOWN */}
          <li className="dropdown">
            <div className="dropdown-link">
              <IoMdArrowDropdown className="nav-icon"  />
              <span>More</span>
            </div>

            <div className="sub-menu">
              <ul>
                <li>
                  <NavLink to="/founder">
                    <FaUserTie className="nav-icon" />
                    <span>Founder</span>
                  </NavLink>
                </li>

                <li>
                  <HashLink smooth to={"/home#testimonials-wrapper"}>
                    <FaComments className="nav-icon" />
                    <span>Testimonials</span>{" "}
                  </HashLink>
                </li>

                <li>
                  <NavLink to={"/blogs"}>
                    <FaBlog className="nav-icon" />
                    <span>Blogs</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to={"/faqs"}>
                    <FaQuestionCircle className="nav-icon" />
                    <span>FAQs</span>
                  </NavLink>
                </li>

                <li>
                  {/* <NavLink  to="/why-us">
                   */}
                  <HashLink smooth to="/home#why-choose-us">
                    <FaStarHalfAlt className="nav-icon" />
                    <span>Why Choose Us</span>
                  </HashLink>
                  {/* </NavLink > */}
                </li>
              </ul>
            </div>
          </li>

          <li>
            <NavLink to="/contact">
              <FaEnvelope className="nav-icon" />
              <span>Contact</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="nav-links-2">
        <ul>
          <li>
            <NavLink to="/register">
              <FaUserPlus className="nav-icon" />
              <span>Register</span>
            </NavLink>
          </li>

          <li>
            <div className="hamburger-menu" onClick={toggleMobileMenu}>
              <FaBars size={24} />{" "}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
