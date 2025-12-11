import "../Css/Testimonials.css";
import TestimonialsCard from "../Cards/TestimonialsCard";
import { motion } from "framer-motion";

const Testimonials = () => {
  return (
    <motion.div
      className="testimonials-wrapper"
      id="testimonials-wrapper"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div class="custom-shape-divider-top-1764543608">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
      <h1 className="header">Testimonials</h1>

      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>

      <p className="header-paragraph">
        Stories from our growing community of young coders and supportive
        parents.
      </p>
      {/* Carousel Container */}
      <div className="carousel">
        <TestimonialsCard />
      </div>
    </motion.div>
  );
};

export default Testimonials;
