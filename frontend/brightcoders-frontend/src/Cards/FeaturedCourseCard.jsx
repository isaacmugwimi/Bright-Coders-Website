import React from "react";
import "../Css/FeaturedCourseCard.css";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const FeaturedCourseCard = ({
  title,
  focus,
  duration,
  fee,
  image,
  header,
  DurationIcon,
}) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.target.preventDefault;
    navigate("/register");
    console.log("Hello")
  };
  return (
    <div className="featured-card" onClick={handleClick}>
      <div className="">
        <div className="image-section">
          <img src={image} alt="Scratch coding Image" />
          <p className="time-box">
            <DurationIcon />
            {duration}
          </p>
        </div>

        <h2>{title}</h2>

        <div className="card-data">
          <div className="focus-data">
            <p className="focus-title">
              <strong>Focus: </strong>
            </p>
            <p>
              {focus.split(",").map((item, index) => (
                <span key={index} className="focus-tag">
                  {item.trim()}
                </span>
              ))}
            </p>
          </div>

          <div className="money-section">
            <p className="fee-p">
              <strong> {fee} </strong>
            </p>
            <h4 className="card-header">{header}</h4>
          </div>
        </div>
      </div>
      <div className="caption">
        <h1>
          Enroll Now <FaArrowRight className="arrow-icon" />
        </h1>
      </div>
    </div>
  );
};

export default FeaturedCourseCard;
