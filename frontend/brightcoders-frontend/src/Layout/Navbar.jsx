import React, { useEffect, useState } from "react";
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
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleMenuClick = (e) => {
    if (!e.target.closest(".dropdown")) {
      setDropDownOpen(false);
    }
  };

  const toggleDropDown = () => {
    setDropDownOpen((prev) => !prev);
  };

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setDropDownOpen(false);
  };

  // Close menu on outside click (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".nav-links") &&
        !e.target.closest(".hamburger-menu")
      ) {
        closeAllMenus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar-main-section">
      <div className="nav-logo">
        <img src={logo} alt="Website Logo" width={"125px"} height={"125px"} />
      </div>

      <div className={`nav-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
        <div className="close-menu" onClick={closeAllMenus}>
          <FaTimes size={22} />
        </div>
        <ul onClick={handleMenuClick}>
          <li>
            <NavLink to="/home" onClick={closeAllMenus}>
              <FaHome className="nav-icon" /> <span>Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/programs" onClick={closeAllMenus}>
              <FaUsers className="nav-icon" />
              <span>Programs</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/about" onClick={closeAllMenus}>
              <FaInfoCircle className="nav-icon" />
              <span>About Us</span>
            </NavLink>
          </li>

          {/* DROPDOWN */}
          <li
            className={`dropdown ${
              dropdownOpen ? "mobile-open active-dropdown" : ""
            }`}
          >
            <div className="dropdown-link" onClick={toggleDropDown}>
              <IoMdArrowDropdown className="nav-icon nav-icon-more" />
              <span>More</span>
            </div>

            <div className="sub-menu">
              <ul>
                <li>
                  <NavLink to="/founder" onClick={closeAllMenus}>
                    <FaUserTie className="nav-icon" />
                    <span>Founder</span>
                  </NavLink>
                </li>

                <li>
                  <HashLink
                    smooth
                    to={"/home#testimonials-wrapper"}
                    onClick={closeAllMenus}
                  >
                    <FaComments className="nav-icon" />
                    <span>Testimonials</span>{" "}
                  </HashLink>
                </li>

                <li>
                  <NavLink to={"/blogs"} onClick={closeAllMenus}>
                    <FaBlog className="nav-icon" />
                    <span>Blogs</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to={"/faqs"} onClick={closeAllMenus}>
                    <FaQuestionCircle className="nav-icon" />
                    <span>FAQs</span>
                  </NavLink>
                </li>

                <li>
                  {/* <NavLink  to="/why-us">
                   */}
                  <HashLink
                    smooth
                    to="/home#why-choose-us"
                    onClick={closeAllMenus}
                  >
                    <FaStarHalfAlt className="nav-icon" />
                    <span>Why Choose Us</span>
                  </HashLink>
                  {/* </NavLink > */}
                </li>
              </ul>
            </div>
          </li>

          <li>
            <NavLink to="/contact" onClick={closeAllMenus}>
              <FaEnvelope className="nav-icon" />
              <span>Contact</span>
            </NavLink>
          </li>
          {mobileMenuOpen && (
            <li>
              <NavLink to="/register" onClick={closeAllMenus}>
                <FaUserPlus className="nav-icon" />
                <span>Register</span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      <div className="nav-links-2">
        <ul onClick={handleMenuClick}>
          {!mobileMenuOpen && (
            <li>
              <NavLink to="/register" onClick={closeAllMenus}>
                <FaUserPlus className="nav-icon" />
                <span>Register</span>
              </NavLink>
            </li>
          )}

          <li>
            <div
              className={`hamburger-menu ${
                mobileMenuOpen ? "hamburger-active" : ""
              }`}
              onClick={toggleMobileMenu}
            >
              <FaBars size={20} />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
