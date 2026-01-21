import { Helmet } from "react-helmet-async";
import Home from "../Components/Home";
import FeaturedCourses from "../Components/FeaturedCourses";
import WhyChoseUs from "../Components/WhyChoseUs";
import HowItWorks from "../Components/HowItWorks";
import AboutHomepage from "../Components/AboutHomepage";
import Testimonials from "../Components/Testimonials";

const DashboardLayout = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
  const fullImageUrl = `${baseUrl}/logo2.png`;

  return (
    <>
      <Helmet>
        {/* Standard SEO */}
        <title>Bright Coders | Learn Programming & Tech Skills in Kenya</title>
        <meta
          name="description"
          content="Bright Coders is a leading tech training institute in Kenya offering programming, web development, and software engineering courses."
        />
        <meta
          name="keywords"
          content="coding school Kenya, programming courses Nairobi, Bright Coders, learn javascript kenya"
        />
        <link rel="canonical" href={`${baseUrl}/home`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/home`} />
        <meta
          property="og:title"
          content="Bright Coders | Tech Training Institute"
        />
        <meta
          property="og:description"
          content="Master coding and software engineering in Kenya. Join Bright Coders today."
        />
        <meta property="og:image" content={fullImageUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Bright Coders | Learn Programming"
        />
        <meta
          name="twitter:description"
          content="Expert tech training in the heart of Kenya."
        />
        <meta name="twitter:image" content={fullImageUrl} />

        {/* ✅ JSON-LD Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Bright Coders",
              "url": "${baseUrl}",
              "logo": "${fullImageUrl}",
              "description": "Fun, friendly coding classes for kids in Kenya.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "KE"
              }
            }
          `}
        </script>
      </Helmet>

      <main>
        <Home />
        <FeaturedCourses />
        <WhyChoseUs />
        <HowItWorks />
        <AboutHomepage />
        <Testimonials />
      </main>
    </>
  );
};

export default DashboardLayout;
