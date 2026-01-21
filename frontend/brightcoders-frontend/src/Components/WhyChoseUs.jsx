import "../Css/WhyChooseUs.css";
import whyChooseUsData from "../Utils/whyChoseUsData.js";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const WhyChooseUs = () => {
  // Structured data for SEO (Google understands this section)
  const whyChooseUsJSONLD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Why Choose Bright Coders",
    itemListElement: whyChooseUsData.map((feature, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: feature.title,
      description: feature.description,
    })),
  };

  return (
    <motion.section
      id="why-choose-us"
      className="why-choose-us"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      aria-labelledby="why-choose-us-heading"
    >
      {/* SEO Structured Data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(whyChooseUsJSONLD)}
        </script>
      </Helmet>

      {/* Section Heading */}
      <motion.h2
        id="why-choose-us-heading"
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Why Choose Bright Coders?
      </motion.h2>

      <div className="horizontal-line">
        <div className="actual-line"></div>
      </div>

      {/* SEO-friendly description */}
      <motion.p
        className="section-subheader"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        Bright Coders offers industry-focused programming training in Kenya,
        combining expert mentorship, hands-on projects, and flexible learning
        paths for beginners and professionals.
      </motion.p>

      {/* Feature Cards */}
      <div className="features-container">
        {whyChooseUsData.map((feature, index) => (
          <motion.article
            key={index}
            className="feature-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon" aria-hidden="true">
              <feature.Icon style={{ color: feature.color }} />
            </div>

            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
};

export default WhyChooseUs;
