import testimonialsData from "../Utils/TestimonialsCardData";
import "../Css/TestimonialsCard.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUserAlt,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { RiDoubleQuotesR } from "react-icons/ri";

const TestimonialsCard = () => {
  const NextArrow = ({ style, onClick }) => (
    <div className={`arrow next`} onClick={onClick} aria-hidden="true">
      <FaChevronRight />
    </div>
  );

  const PrevArrow = ({ style, onClick }) => (
    <div className={`arrow prev`} onClick={onClick} aria-hidden="true">
      <FaChevronLeft />
    </div>
  );

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3, // default for large screens
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplaySpeed: 3000,
    autoplay: true,
    pauseOnHover: true,
    swipeToSlide: true,

    /* responsive breakpoints - important order doesn't matter but values do */
    responsive: [
      {
        breakpoint: 1600, // <=1599px
        settings: {
          slidesToShow: 3,
          centerMode: true,
        },
      },
      {
        breakpoint: 1024, // <=1023px
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 780, // <=599px
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="carousel-inner">
      <Slider {...settings}>
        {testimonialsData.map((item, idx) => (
          <div className="corousel-item" key={idx}>
            <p className="testimonial-feedback">"{item.feedback}"</p>
            <h4 className="courousel-name">{item.name}</h4>
            <span>{item.role}</span>
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
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="placeholder-icon">
                  <FaUserAlt />
                </div>
              )}
            </div>

            <div className="quotes-mark" aria-hidden="true">
              <RiDoubleQuotesR size={180} color="silver" />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialsCard;
