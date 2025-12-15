import scratchImage from "../assets/Scratch-Coding-blog.webp";
import htmlIcon from "../assets/html2.webp";
import jsIcon from "../assets/istockphoto-js.webp";
import { FiClock } from "react-icons/fi";
import pythonIcon from "../assets/python.webp";

const featuredCourseData = [
  {
    title: "Scratch Coding Introduction",
    header1: "Beginner",
    image: scratchImage,
    focus: "Animations, games, logic building.",
    duration: "3 weeks",
    DurationIcon: FiClock,
    fee: "KSh. 3,000",
  },
  {
    title: "HTML & CSS",
    header1: "Intermediate",
    image: htmlIcon,
    focus: "Web pages,  layouts, creativity.",
    duration: "3 weeks",
    DurationIcon: FiClock,
    fee: "KSh. 3,000",
  },
  {
    title: "Junior JavaScript",
    header1: "Advanced",
    image: jsIcon,
    focus: "websites, variables, problem solving.",
    duration: "3 weeks",
    DurationIcon: FiClock,
    fee: "KSh. 3,000",
  },
  {
    title: "Python for Kids",
    header1: "Beginner",
    image: pythonIcon,
    focus: "Games, basic algorithms, problem solving.",
    duration: "3 weeks",
    DurationIcon: FiClock,
    fee: "KSh. 3,000",
  },
  // {
  //   title: "Python for Kids",
  //   header1: "Beginner",
  //   image: pythonIcon,
  //   focus: "Games, basic algorithms, problem solving.",
  //   duration: "3 weeks",
  //   DurationIcon: FiClock,
  //   fee: "KSh. 3,000",
  // },
];

export default featuredCourseData;
