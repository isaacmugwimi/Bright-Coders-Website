import React, { useState } from "react";
import { FaHome, FaPhone, FaPhoneVolume, FaVoicemail } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";
import "../Css/Contact.css";
// import back_img from "../assets/Untitled design1.png";

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
      console.log("Form submitted successfully!");
      event.target.reset();
    } else {
      console.error("It failed Error", data);
      setResults(data.message || "Something Went Wrong!");
    }
    setTimeout(() => {
      setResults("");
    }, 3000);
  };

  return (
    <div className="contact-section">
      <section className="contact-banner">
        <h1>
          Contact <span>Us</span>
        </h1>
        <p>Get in touch and let’s start your learning journey together.</p>
      </section>
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
              className={`phone ${
                activeContact === "phone" ? "active" : ""
              }`}
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
            <div className="first-name  input-section">
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
                id=""
                required
                maxLength={240}
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
    </div>
  );
};

export default Contact;
