import React, { useEffect, useState } from "react";
import "../Css/TestimonialsCard.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios"; // or your axiosInstance
import {
  FaChevronLeft,
  FaChevronRight,
  FaUserAlt,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { RiDoubleQuotesR } from "react-icons/ri";

const TestimonialsCard = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [liveTestimonials, setLiveTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Live Data ---
  useEffect(() => {
    const fetchLiveReviews = async () => {
      try {
        const response = await axios.get(
          `${API_URL.replace(/\/$/, "")}/api/testimonials/live`
        );
        setLiveTestimonials(response.data);
      } catch (error) {
        console.error("Error loading testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveReviews();
  }, [API_URL]);

  const NextArrow = ({ onClick }) => (
    <div className="arrow next" onClick={onClick} aria-hidden="true">
      <FaChevronRight />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="arrow prev" onClick={onClick} aria-hidden="true">
      <FaChevronLeft />
    </div>
  );

  const settings = {
    infinite: liveTestimonials.length > 3, // Only loop if we have enough cards
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerMode: false } },
      { breakpoint: 600, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  if (loading) return <div className="loading">Loading stories...</div>;
  if (liveTestimonials.length === 0) return null; // Hide section if no reviews approved

  return (
    <div className="carousel-inner">
      <Slider {...settings}>
        {liveTestimonials.map((item) => (
          <div className="corousel-item" key={item.id}>
            {/* Database uses 'message', Joi uses 'message' */}
            <p className="testimonial-feedback">"{item.message}"</p>

            {/* Database uses 'user_name' */}
            <h4 className="courousel-name">{item.user_name}</h4>
            <span>{item.user_role}</span>

            <div className="testimonial-stars">
              {[...Array(5)].map((_, index) =>
                index < item.rating ? (
                  <FaStar key={index} color="#FFD700" />
                ) : (
                  <FaRegStar key={index} color="#FFD700" />
                )
              )}
            </div>

            <div className="testimonial-image-section">
              {item.image_url ? (
                <img
                  src={
                    item.image_url.startsWith("http")
                      ? item.image_url
                      : `${API_URL.replace(/\/$/, "")}/${item.image_url.replace(
                          /^\//,
                          ""
                        )}`
                  }
                  alt={item.user_name}
                />
              ) : (
                <div className="placeholder-icon">
                  <FaUserAlt />
                </div>
              )}
            </div>

            <div className="quotes-mark" aria-hidden="true">
              <RiDoubleQuotesR size={150} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialsCard;
