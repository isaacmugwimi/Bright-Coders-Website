import React, { useState } from "react";
import { FaPhoneVolume, FaDonate, FaUsers, FaBullhorn, FaPhoneAlt } from "react-icons/fa";
import { MdLocalPhone, MdMarkEmailUnread } from "react-icons/md";
import { Helmet } from "react-helmet-async";
import "../Css/Contact.css";
import { validateContact } from "../helper/validateContact";
import axios from "axios";

const Contact = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [results, setResults] = useState("");
  const [popupText, setPopupText] = useState("");
  const [activeContact, setActiveContact] = useState("");
const [errors, setErrors] = useState({});
const [showModal, setShowModal] = useState(false);
  const siteUrl = import.meta.env.VITE_SITE_URL; // Use env for canonical & og URLs

  // Function for Hovering (Visual Only)
  const handleMouseEnter = (type) => {
    if (type === "email") {
      setPopupText("developerisaac92@gmail.com");
      setActiveContact("email");
    } else {
      setPopupText("+254 740 073 575");
      setActiveContact("phone");
    }
  };

  // Function for Leaving (Clears the visual)
  const handleMouseLeave = () => {
    setActiveContact("");
    setPopupText("");
  };

  // Function for Clicking (Triggers Action)
  const handleEmailClick = () => {
    const recipient = "developerisaac92@gmail.com";
    const subject = encodeURIComponent("Inquiry for Bright Coders");
    const body = encodeURIComponent(
      "Hello,\n\nI'm interested in learning more about your programs.",
    );

    // This opens the user's email client (Gmail/Outlook)
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+254740073575";
  };

  // --- SUBMISSION LOGIC ---
  const handleOnSubmit = async (event) => {
    event.preventDefault()
    setErrors({}); // Clear previous errors

    const formElement = event.target
    const dataToValidate = {
      fullName: formElement.Name.value,
      email:formElement.Email.value,
      message:formElement.Message.value
    }

// 2. Validate the plain object
    const {isValid, errors:validationErrors}=validateContact(dataToValidate);

    if(!isValid){
      setErrors(validationErrors)
      return
    }

   
    setResults("Sending...");

   

    


    try {
      const submitPath =`${API_URL.replace(/\/$/, "")}/contact/submit`;
      const response = await axios.post(submitPath, dataToValidate);

      if (response.status === 200 || response.status === 201) {
        setShowModal(true)
        setResults("");
        formElement.reset();
      } else {
        setResults( "Something Went Wrong!");
      }
    } catch (err) {
      console.error("Submission Error:",err);
      setResults("Something Went Wrong!");
    }
    setTimeout(() => setResults(""), 3000);
  };

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>Contact Bright Coders | Kids Coding Academy in Kenya</title>
        <meta
          name="description"
          content="Get in touch with Bright Coders, Kenya’s leading kids coding academy. Ask questions, enroll in programs, or support our mission."
        />
        <meta
          name="keywords"
          content="Bright Coders contact, kids coding Kenya, coding academy, contact form, donate, volunteer"
        />
        <link rel="canonical" href={`${siteUrl}/contact`} />

        {/* Open Graph */}
        <meta property="og:title" content="Contact Bright Coders" />
        <meta
          property="og:description"
          content="Reach out to Bright Coders to learn more, enroll, or support our kids coding programs."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/contact`} />
        <meta property="og:image" content={`${siteUrl}/og-contact.jpg`} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Bright Coders",
            url: siteUrl,
            email: "brightcoderske@gmail.com",
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+254740073575",
                contactType: "customer service",
                areaServed: "KE",
              },
            ],
            sameAs: [
              "https://www.facebook.com/brightcoders",
              "https://www.instagram.com/brightcoders",
            ],
          })}
        </script>
      </Helmet>

      {/* ================= PAGE CONTENT ================= */}
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
            <h2>Talk to us today</h2>
            <p className="left-contact-p1">
              Get in touch and let’s start your learning journey together.
            </p>
            <div className="contact-data">
              {/* EMAIL BOX */}
              <div
                className={`email ${activeContact === "email" ? "active" : ""}`}
                onMouseEnter={() => handleMouseEnter("email")}
                onMouseLeave={handleMouseLeave}
                onClick={handleEmailClick}
                style={{ cursor: "pointer" }} // Makes it look clickable
              >
                <MdMarkEmailUnread />
                <p>Email</p>
              </div>

              {/* PHONE BOX */}
              <div
                className={`phone ${activeContact === "phone" ? "active" : ""}`}
                onMouseEnter={() => handleMouseEnter("phone")}
                onMouseLeave={handleMouseLeave}
                onClick={handlePhoneClick}
                style={{ cursor: "pointer" }}
              >
                <MdLocalPhone />
                <p>Phone</p>
              </div>

              {/* SHARED DETAILS DISPLAY */}
              <div className="email-Phone-details">
                <span>{popupText}</span>
              </div>
            </div>
          </div>

          <div className="right-contact">
            <form onSubmit={handleOnSubmit}>
              <div className="first-name input-section">
                <p>First Name</p>
                <input
                  type="text"
                  placeholder="e.g Isaac"
                  name="Name"
                  required
                />
                {errors.fullName && <small className="error-text" style={{color: 'red', fontSize: '12px'}}>{errors.fullName}</small>}
              </div>
              <div className="contact-email input-section">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="e.g isaac@gmail.com"
                  name="Email"
                  required
                />
                                {errors.email && <small className="error-text" style={{color: 'red', fontSize: '12px'}}>{errors.fullName}</small>}

              </div>
              <div className="contact-address">
                <p>Message</p>
                <textarea
                  name="Message"
                  placeholder="Enter your message"
                  maxLength={240}
                  required
                ></textarea>
                                {errors.message && <small className="error-text" style={{color: 'red', fontSize: '12px'}}>{errors.fullName}</small>}

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

      {showModal && (
  <div className="contact-modal-overlay">
    <div className="contact-modal-content">
      <div className="contact-success-icon">✓</div>
      <h2>Message Sent!</h2>
      <p>
        Thank you, <strong>{activeContact === "email" || "Student"}</strong>! 
r inquiry has been received. Our team at Bright Coders will get back to you 
        within 24 hours.        You
      </p>
      <button onClick={() => setShowModal(false)} className="contact-close-modal-btn">
        Back to Website
      </button>
    </div>
  </div>
)}
    </>
  );
};

export default Contact;
