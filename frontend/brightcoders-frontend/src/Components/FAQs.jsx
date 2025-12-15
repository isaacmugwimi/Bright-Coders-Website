import React, { useState, useEffect, useRef } from "react";
import "../Css/FAQs.css";
import { FaChevronDown } from "react-icons/fa";
import faqs from "../Utils/faqsData";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [visibleFaqs, setVisibleFaqs] = useState([]);
  const [remainingFaqs, setRemainingFaqs] = useState([...faqs]);
  const faqListRef = useRef(null);

  // Load initial 5 FAQs
  useEffect(() => {
    loadMoreFaqs();
  }, []);

  // Scroll event to load more FAQs
  useEffect(() => {
    const handleScroll = () => {
      const faqList = faqListRef.current;
      if (!faqList) return;

      // Check if scrolled to bottom
      if (faqList.scrollTop + faqList.clientHeight >= faqList.scrollHeight - 5) {
        loadMoreFaqs();
      }
    };

    const faqList = faqListRef.current;
    faqList.addEventListener("scroll", handleScroll);

    return () => faqList.removeEventListener("scroll", handleScroll);
  }, [remainingFaqs, visibleFaqs]);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Load 5 FAQs at a time without repeating
  const loadMoreFaqs = () => {
    if (remainingFaqs.length === 0) return;

    const nextBatch = remainingFaqs.slice(0, 5); // take first 5
    const newRemaining = remainingFaqs.slice(5); // remaining FAQs

    setVisibleFaqs(prev => [...prev, ...nextBatch]);
    setRemainingFaqs(newRemaining);
  };

  return (
    <div className="faq-container">
     <div className="faq-header-section">
       <h2 className="faq-title">Frequently Asked Questions</h2>
      <p className="faq-subtitle">
        Everything you need to know before enrolling at Bright Coders.
      </p>
     </div>

      <div
        className="faq-list"
        ref={faqListRef}
        
      >
        {visibleFaqs.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFaq(index)}
          >
            <div className="faq-question">
              <span>{item.question}</span>
              <FaChevronDown className="faq-icon" />
            </div>

            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}

        {/* Optional message at the end */}
        {remainingFaqs.length === 0 && visibleFaqs.length > 0 && (
          <p style={{ textAlign: "center", marginTop: "15px", color: "#555" }}>
            You’ve reached the end of the FAQs!
          </p>
        )}
      </div>
    </div>
  );
};

export default FAQs;
