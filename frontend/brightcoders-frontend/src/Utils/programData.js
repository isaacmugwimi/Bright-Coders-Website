import scratchImage from "../assets/Scratch-Coding-blog.webp";
import htmlIcon from "../assets/html2.webp";
import jsIcon from "../assets/istockphoto-js.webp";
import { FiClock } from "react-icons/fi";
import pythonIcon from "../assets/python.webp";

import ml from "../assets/ml.webp"
const programData = [
    {
      category: "Young Coders (Grades 1–3)",
      items: [
        {
          title: "Scratch Coding Introduction",
          duration: "3 weeks",
          price: "KSh 3,000",
          focus: ["Animations", "Games", "Logic"],
          level: "Beginner",
          image: scratchImage,
        },
        {
          title: "Scratch Game Development",
          duration: "4 weeks",
          price: "KSh 3,500",
          focus: ["Game logic", "Sprites", "Storytelling"],
          level: "Beginner",
          image: scratchImage,
        },
         {
          title: "Scratch Game Development 2",
          duration: "4 weeks",
          price: "KSh 3,500",
          focus: ["Game logic", "Sprites", "Storytelling"],
          level: "intermediate",
          image: scratchImage,
        },
        
 
     
      ],
    },
    {
      category: "Junior Coders (Grades 4–6)",
      items: [
        {
          title: "HTML & CSS",
          duration: "3 weeks",
          price: "KSh 3,000",
          focus: ["Web Pages", "Layouts", "Creativity"],
          level: "Intermediate",
          image: htmlIcon,
        },
        {
          title: "Junior JavaScript",
          duration: "3 weeks",
          price: "KSh 3,000",
          focus: ["Variables", "Websites", "Logic"],
          level: "Advanced",
          image: jsIcon,
        },
        
      ],
    },
    {
      category: "Teen Coders (Grades 7–9)",
      items: [
        {
          title: "Python for Kids",
          duration: "3 weeks",
          price: "KSh 3,000",
          focus: ["Games", "Basics", "Problem Solving"],
          level: "Beginner",
          image: pythonIcon,
        },
         {
          title: "Machine learning for kids ",
          duration: "3 weeks",
          price: "KSh 3,000",
          focus: ["Games", "Basics", "Problem Solving"],
          level: "Beginner",
          image: ml,
        },
             {
          title: "Python for Kids",
          duration: "3 weeks",
          price: "KSh 3,000",
          focus: ["Games", "Basics", "Problem Solving"],
          level: "Beginner",
          image: pythonIcon,
        },
      ],
    },
  ];

  export default programData