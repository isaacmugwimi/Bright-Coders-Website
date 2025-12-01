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
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
const TestimonialsCard = () => {
  const NextArrow = ({ onClick }) => {
    return (
      <div className="arrow next" onClick={onClick}>
        <FaChevronRight />
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="arrow prev" onClick={onClick}>
        <FaChevronLeft />
      </div>
    );
  };

  var settings = {
    // dots: true,

    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="carousel-inner">
      <Slider {...settings}>
        {testimonialsData.map((item) => (
          <div className="corousel-item">
            <p className="testimonial-feedback">"{item.feedback}"</p>
            <h4 className="courousel-name">{item.name}</h4>
            <span>{item.role}</span>
            <div className="testimonial-stars">
              {[...Array(5)].map((_, index) => {
                return index < item.rating ? (
                  <FaStar key={index} color="#FFD700" />
                ) : (
                  <FaRegStar key={index} color="#FFD700" />
                );
              })}
            </div>
            <div className="testimonial-image-section">
              {item.image ? (
                <img src={item.image} alt="" />
              ) : (
                <div className="placeholder-icon">
                  <FaUserAlt />
                </div>
              )}
            </div>
            <div className="quotes-mark">
              <RiDoubleQuotesR size={180} color="silver" />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialsCard;
