import "../Css/Testimonials.css";
import TestimonialsCard from "../Cards/TestimonialsCard";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/testimonials/live`,
        );
        setTestimonials(response.data.slice(0, 15));
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    };
    fetchTestimonials();
  }, []);

  // Generate JSON-LD structured data for Google
  const generateJSONLD = () => {
    if (!testimonials.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Bright Coders Testimonials",
      itemListElement: testimonials.map((item, index) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: item.user_name,
        },
        reviewBody: item.message,
        reviewRating: {
          "@type": "Rating",
          ratingValue: item.rating,
          bestRating: 5,
          worstRating: 1,
        },
        position: index + 1,
      })),
    };
  };

  return (
    <motion.section
      className="testimonials-wrapper"
      id="testimonials-wrapper"
      aria-labelledby="testimonials-heading"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <Helmet>
        <title>Testimonials | Bright Coders</title>
        <meta
          name="description"
          content="Read real stories and reviews from students and parents at Bright Coders. Discover how our coding programs help young learners in Kenya succeed."
        />
        <script type="application/ld+json">
          {JSON.stringify(generateJSONLD())}
        </script>
      </Helmet>

      <div className="custom-shape-divider-top-1764543608">
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

      <h2 id="testimonials-heading" className="header">
        Testimonials
      </h2>

      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>

      <p className="header-paragraph">
        Stories from our growing community of young coders and supportive
        parents.
      </p>

      {/* Carousel Container */}
      <TestimonialsCard />
    </motion.section>
  );
};

export default Testimonials;
