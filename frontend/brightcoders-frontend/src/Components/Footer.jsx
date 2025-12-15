import React from "react";
import { Link } from "react-router-dom";
import { HiDesktopComputer } from "react-icons/hi";

import "../Css/Footer.css";
import logo from "../assets/logo2.png";
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaInstagram,
  FaArrowRight,
} from "react-icons/fa";

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer">
      <section className="shape-divider">
        <div className="custom-shape-divider-top-1764542905">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>
      <HiDesktopComputer size={400} className="background-img" />

      <section className="main-footer">
        <div className="f-column-1">
          <img src={logo} alt="Bright Coders' Logo" className="f-logo" />
          <p className="f-column-1-title">
            {" "}
            Bright Coders is a coding academy helping kids and teens learn
            programming through fun, interactive, and project-based learning.
          </p>

          <div className="contact-info">
            <div>
              <FaMapMarkerAlt size={22} color="#FF3B30" />{" "}
              <p>Kahawa West, Kenya</p>
            </div>
            <div>
              <FaPhoneAlt size={22} color="#34C759" />{" "}
              <a href="tel:+254 740 073 575" className="phone-link">
                +254 740 073 575
              </a>
            </div>
            <div>
              <FaEnvelope size={22} color="#0A84FF" />{" "}
              <a href="mailto:brightcoderske@gmail.com" className="email-link">
                brightcoderske@gmail.com
              </a>
            </div>
          </div>
        </div>
        <div className="f-column-2">
          <h2 className="f-column-2-head">QuickLinks</h2>
          <div className="quick-links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/programs">Programs</Link>
              </li>
              <li>
                <Link to="/testimonials">Testimonials</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="f-column-3">
          <h2>Contacts</h2>
          <p className="f-column-3-title">
            Enter your Email Address to register to our newsletter subscription
          </p>
          <form action="" className="news-letter-form">
            <input type="email" required placeholder="Your email" />
            <button>
              Subscribe <FaArrowRight size={15} color="#fff" />
            </button>
          </form>

          <div className="social-icons flex gap-4">
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://brightcoders.com&quote=${encodeURIComponent(
                "Hello! I am interested in learning more about Bright Coders programs."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="facebook"
            >
              <FaFacebookF />
            </a>

            {/* Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                "Hello! I am interested in learning more about Bright Coders programs."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="twitter"
            >
              <FaTwitter />
            </a>

            <a
              href="https://www.instagram.com/brightcoders"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram"
            >
              <FaInstagram />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/254757810818?text=${encodeURIComponent(
                "Hello! I am interested in learning more about Bright Coders programs."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
