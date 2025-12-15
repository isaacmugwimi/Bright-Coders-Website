
import "../Css/WhyChooseUs.css";
import whyChooseUsData from "../Utils/whyChoseUsData.js";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  return (
    <motion.div
    id="why-choose-us"
      className="why-choose-us"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Why Choose Us?
      </motion.h2>

      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>

      <motion.p
        className="section-subheader"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        Our platform is designed to make learning easy, interactive, and
        effective.
      </motion.p>

      <div className="features-container">
        {whyChooseUsData.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <feature.Icon style={{ color: feature.color }} />
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WhyChooseUs;
