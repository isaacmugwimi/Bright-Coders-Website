import React, { useState } from "react";
import {
  FaHome,
  FaPhone,
  FaPhoneVolume,
  FaVoicemail,
  FaHandsHelping,
  FaDonate,
  FaUsers,
  FaBullhorn,
} from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";
import "../Css/Contact.css";

const Contact = () => {
  const [results, setResults] = useState("");
  const [popupText, setPopupText] = useState("");
  const [activeContact, setActiveContact] = useState("");

  const handleEmailPopup = () => {
    setPopupText("brightcoderske@gmail.com");
    setActiveContact("email");
    setTimeout(() => {
      setActiveContact("");
      setPopupText("");
    }, 3000);
  };

  const handlePhonePopup = () => {
    setPopupText("+254 740 073 575");
    setActiveContact("phone");
    setTimeout(() => {
      setActiveContact("");
      setPopupText("");
    }, 3000);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setResults("Sending...");
    const formData = new FormData(event.target);
    formData.append("access_key", "d9cfaaad-1342-424f-8bdf-011516147439");
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.success) {
      setResults("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.error("Error", data);
      setResults(data.message || "Something Went Wrong!");
    }
    setTimeout(() => {
      setResults("");
    }, 3000);
  };

  return (
    <div className="contact-section">
      {/* CONTACT BANNER */}
      <section className="contact-banner">
        <h1>
          Contact <span>Us</span>
        </h1>
        <p>Get in touch and let’s start your learning journey together.</p>
      </section>

      {/* CONTACT BODY */}
      <section className="contact-body">
        <div className="left-contact">
          <h1>Talk to us today</h1>
          <p className="left-contact-p1">
            Get in touch and let’s start your learning journey together.
          </p>
          <div className="contact-data">
            <div
              className={`email ${activeContact === "email" ? "active" : ""}`}
              onClick={handleEmailPopup}
            >
              <MdMarkEmailUnread />
              <p>Email</p>
            </div>
            <div
              className={`phone ${activeContact === "phone" ? "active" : ""}`}
              onClick={handlePhonePopup}
            >
              <FaPhoneVolume />
              <p>Phone</p>
            </div>
            <div className="email-Phone-details">
              <span>{popupText}</span>
            </div>
          </div>
        </div>

        <div className="right-contact">
          <form onSubmit={handleOnSubmit}>
            <div className="first-name input-section">
              <p>First Name</p>
              <input type="text" placeholder="e.g Isaac" name="Name" required />
            </div>
            <div className="contact-email input-section">
              <p>Email</p>
              <input
                type="email"
                placeholder="e.g isaac@gmail.com"
                name="Email"
                required
              />
            </div>
            <div className="contact-address">
              <p>Message</p>
              <textarea
                name="Message"
                placeholder="Enter your message"
                maxLength={240}
                required
              ></textarea>
            </div>
            <div className="btn-div">
              <button type="submit">Send Message</button>
            </div>
          </form>

          <div className="toast-message">
            <span
              style={{
                color: "#041E43",
                fontWeight: "600",
                fontSize: "17px",
                fontStyle: "italic",
                fontFamily: "system-ui",
                textAlign: "center",
              }}
            >
              {results}
            </span>
          </div>
        </div>
      </section>

      {/* SUPPORT US SECTION */}
      {/* SUPPORT US SECTION */}
      <section className="support-us-section">
        <h2>Support Bright Coders</h2>
        <p>
          Your support helps us reach more young learners and improve our
          programs. Here’s how you can help:
        </p>
        <div className="support-options">
          <div className="support-card">
            <FaDonate className="support-icon" />
            <h3>Donate</h3>
            <p>
              Contribute to our mission and help provide resources for coding
              classes.
            </p>
            <button>Donate Now</button>
          </div>
          <div className="support-card">
            <FaUsers className="support-icon" />
            <h3>Volunteer</h3>
            <p>
              Share your skills and time to mentor kids in coding and
              technology.
            </p>
            <button>Join as Volunteer</button>
          </div>
          <div className="support-card">
            <FaBullhorn className="support-icon" />
            <h3>Spread the Word</h3>
            <p>
              Help us reach more learners by sharing our programs with your
              network.
            </p>
            <button>Share</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
