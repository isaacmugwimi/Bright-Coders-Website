import React from "react";
import { Link } from "react-router-dom";
import "../Css/Footer.css";
import logo from "../assets/logo2.png";

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

      <section className="main-footer">
        <div className="footer-section section-m1">
          {/* SECTION 1 */}
          <div className="footer1">
            <Link to="/">
              <img
                src={logo}
                alt="Website Logo"
                width={"125px"}
                height={"125px"}
              />
            </Link>

            <h4>
              <strong>Contact</strong>
            </h4>
            <p>
              <strong>Address:</strong> 64200 Chuka Street 35 KCB bank
            </p>
            <p>
              <strong>Phone:</strong> 0757810818
            </p>
            <p>
              <strong>Hours:</strong> 9:00-5:00
            </p>

            <h4 className="follow-us">Follow Us</h4>

            <div className="social-media">
              <Link to="#">
                <img src="img/facebook.png" alt="" />
              </Link>
              <Link to="#">
                <img src="img/twitter.png" alt="" />
              </Link>
              <Link to="#">
                <img src="img/whatsapp_icon.png" alt="" />
              </Link>
              <Link to="#">
                <img src="img/instagram_icon.png" alt="" />
              </Link>
              <Link to="#">
                <img src="img/google.png" alt="" />
              </Link>
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="footer2">
            <h3>About</h3>
            <ul id="about-column">
              <li>
                <Link to="/about">About us</Link>
              </li>
              <li>
                <Link to="/delivery">Delivery Information</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* SECTION 3 */}
          <div className="footer2">
            <h3>My Account</h3>
            <ul id="account">
              <li>
                <Link to="/login">Sign In</Link>
              </li>
              <li>
                <Link to="/cart">View Cart</Link>
              </li>
              <li>
                <Link to="/wallet">My Wallet</Link>
              </li>
              <li>
                <Link to="/track">Track My Order</Link>
              </li>
              <li>
                <Link to="/help">Help</Link>
              </li>
            </ul>
          </div>

          {/* SECTION 4 */}
          <div className="footer4">
            <h4>Install App</h4>
            <p>from App Store or Google Play</p>

            <div className="apps">
              <img src="img/pay/app.jpg" alt="" />
              <img src="img/pay/play.jpg" alt="" />
            </div>

            <p>Secured Payment Gateway</p>
            <img src="img/pay/pay.png" alt="" />
          </div>

          <div className="copyright">
            <p>©2025, HTML CSS Ecommerce Website</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
