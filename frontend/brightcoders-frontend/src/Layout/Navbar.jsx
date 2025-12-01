import React from "react";
import { Link } from "react-router-dom";
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
          <li className="active">
            <Link to="/home">
              <FaHome className="nav-icon" /> <span>Home</span>
            </Link>
          </li>

          <li>
            <Link to="/programs">
              <FaUsers className="nav-icon" />
              <span>Programs</span>
            </Link>
          </li>

          <li>
            <Link to="/about">
              <FaInfoCircle className="nav-icon" />
              <span>About Us</span>
            </Link>
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
                  <Link to="/founder">
                    <FaUserTie className="nav-icon" />
                    <span>Founder</span>
                  </Link>
                </li>

                <li>
                  <Link to="/testimonials">
                    <FaComments className="nav-icon" />
                    <span>Testimonials</span>
                  </Link>
                </li>

                <li>
                  <Link>
                    <FaBlog className="nav-icon" />
                    <span>Blogs</span>
                  </Link>
                </li>

                <li>
                  <Link to="/faqs">
                    <FaQuestionCircle className="nav-icon" />
                    <span>FAQs</span>
                  </Link>
                </li>

                <li>
                  <Link to="/gallery">
                    <FaImages className="nav-icon" />
                    <span>Gallery</span>
                  </Link>
                </li>

                <li>
                  <Link to="/why-us">
                    <FaStarHalfAlt className="nav-icon" />
                    <span>Why Choose Us</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Link to="/contact">
              <FaEnvelope className="nav-icon" />
              <span>Contact</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="nav-links-2">
        <ul>
          <li>
            <Link to="/register">
              <FaUserPlus className="nav-icon" />
              <span>Register</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
