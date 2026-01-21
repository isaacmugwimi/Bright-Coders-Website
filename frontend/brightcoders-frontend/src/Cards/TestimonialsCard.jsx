import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import required modules
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";

import {
  FaUserAlt,
  FaStar,
  FaRegStar,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { RiDoubleQuotesR } from "react-icons/ri";
import "../Css/TestimonialsCard.css";

const TestimonialsCard = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [liveTestimonials, setLiveTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveReviews = async () => {
      try {
        const response = await axios.get(
          `${API_URL.replace(/\/$/, "")}/testimonials/live`,
        );

        setLiveTestimonials(response.data.slice(0, 15));
      } catch (error) {
        console.error("Error loading testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveReviews();
  }, [API_URL]);

  if (loading) return <div className="loading">Loading stories...</div>;
  if (liveTestimonials.length === 0) return null;

  return (
    <div className="carousel-inner">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"} // "auto" is key for the 3D effect to look right
        loop={liveTestimonials.length > 2}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 20, // Slide rotation in degrees
          stretch: -10, // Stretch space between slides
          depth: 250, // Depth offset (how far back side slides go)
          modifier: 1, // Effect multiplier
          slideShadows: true, // Set to true for a more dramatic 3D look
        }}
        navigation={{
          nextEl: ".button-next-custom",
          prevEl: ".button-prev-custom",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true, // This limits the visible dots
          dynamicMainBullets: 3, // This keeps the focus on just 3 dots
        }}
        // navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        {liveTestimonials.map((item) => (
          <SwiperSlide key={item.id} style={{ width: "300px" }}>
            <article
              className="corousel-item"
              aria-label={`Testimonial by ${item.user_name}`}
            >
              <blockquote className="testimonial-feedback">
                "{item.message}"
              </blockquote>
              <footer>
                <h4 className="courousel-name">{item.user_name}</h4>
                <span>{item.user_role}</span>
              </footer>

              <div
                className="testimonial-stars"
                aria-label={`Rating: ${item.rating} out of 5`}
              >
                {[...Array(5)].map((_, index) =>
                  index < item.rating ? (
                    <FaStar key={index} color="#FFD700" aria-hidden="true" />
                  ) : (
                    <FaRegStar key={index} color="#FFD700" aria-hidden="true" />
                  ),
                )}
              </div>

              <div className="testimonial-image-section">
                {item.image_url ? (
                  <img
                    src={
                      item.image_url.startsWith("http")
                        ? item.image_url
                        : `${API_URL.replace(/\/api$/, "")}/${item.image_url.replace(/^\/+/, "")}`
                    }
                    alt={`Photo of ${item.user_name}`}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  className="placeholder-icon"
                  style={{ display: item.image_url ? "none" : "flex" }}
                  aria-hidden="true"
                >
                  <FaUserAlt />
                </div>
              </div>

              <div className="quotes-mark" aria-hidden="true">
                <RiDoubleQuotesR size={150} />
              </div>
            </article>
          </SwiperSlide>
        ))}

        <div className="button-prev-custom">
          <FaChevronLeft />
        </div>
        <div className="button-next-custom">
          <FaChevronRight />
        </div>
      </Swiper>
    </div>
  );
};

export default TestimonialsCard;
