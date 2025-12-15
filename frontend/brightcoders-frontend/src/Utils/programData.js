import scratchImage from "../assets/Scratch-Coding-blog.webp";
import htmlIcon from "../assets/html2.webp";
import jsIcon from "../assets/istockphoto-js.webp";
import pythonIcon from "../assets/python.webp";
import ml from "../assets/ml.webp";

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
        description: {
          definition:
            "This course introduces young learners to coding through Scratch, a visual programming language designed for beginners. Students will learn to create simple animations and interactive stories while understanding basic programming concepts.",
          learningPoints: [
            "Understand the basics of Scratch interface",
            "Create animations and interactive stories",
            "Learn problem-solving and logical thinking",
            "Explore loops, conditions, and events",
            "Build confidence in programming",
          ],
          outcome:
            "By the end of the course, students will be able to design simple games and animations independently, fostering creativity and computational thinking.",
        },
        requirements: [
          "A computer or tablet",
          "Internet access",
          "Curiosity and willingness to learn",
        ],
      },
      {
        title: "Scratch Game Development",
        duration: "4 weeks",
        price: "KSh 3,500",
        focus: ["Game logic", "Sprites", "Storytelling"],
        level: "Beginner",
        image: scratchImage,
        description: {
          definition:
            "Dive deeper into Scratch by building your own interactive games. This course focuses on game design principles, storytelling, and character animation.",
          learningPoints: [
            "Develop game logic and rules",
            "Animate characters and sprites",
            "Incorporate sound and visuals",
            "Use events and variables effectively",
            "Share games with peers",
          ],
          outcome:
            "Students will create playable games that showcase creativity and problem-solving skills, preparing them for more advanced programming challenges.",
        },
        requirements: [
          "Completion of Scratch Coding Introduction recommended",
          "Computer or tablet",
        ],
      },
      {
        title: "Scratch Game Development 2",
        duration: "4 weeks",
        price: "KSh 3,500",
        focus: ["Game logic", "Sprites", "Storytelling"],
        level: "Intermediate",
        image: scratchImage,
        description: {
          definition:
            "An intermediate course for students who want to take their Scratch game development skills further. Focus on more complex games, interactive stories, and advanced Scratch features.",
          learningPoints: [
            "Design multi-level games",
            "Use advanced Scratch blocks",
            "Implement scoring and challenges",
            "Collaborate on storytelling projects",
            "Refine user experience",
          ],
          outcome:
            "Students will confidently create advanced interactive games, enhancing creativity, logical reasoning, and programming skills.",
        },
        requirements: [
          "Scratch Game Development 1",
          "Basic understanding of Scratch interface",
        ],
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
        description: {
          definition:
            "Learn to create beautiful and responsive web pages using HTML and CSS. This course introduces essential web design concepts and front-end development skills.",
          learningPoints: [
            "Structure web pages with HTML",
            "Style web pages using CSS",
            "Understand layout and design principles",
            "Add images, links, and lists",
            "Create a personal mini-website",
          ],
          outcome:
            "By the end, students will have their own styled web pages and a foundation for further web development.",
        },
        requirements: ["Basic computer skills", "Internet access"],
      },
      {
        title: "Junior JavaScript",
        duration: "3 weeks",
        price: "KSh 3,000",
        focus: ["Variables", "Websites", "Logic"],
        level: "Advanced",
        image: jsIcon,
        description: {
          definition:
            "Introduce young learners to JavaScript to make websites interactive. This course covers fundamental programming concepts applied to web pages.",
          learningPoints: [
            "Understand variables and data types",
            "Use conditions and loops",
            "Respond to user actions",
            "Modify web page content dynamically",
            "Build simple interactive games",
          ],
          outcome:
            "Students will create interactive web elements and simple web-based games, preparing them for more advanced coding.",
        },
        requirements: ["HTML & CSS basics", "Curiosity and logical thinking"],
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
        description: {
          definition:
            "Learn Python, a beginner-friendly programming language, through fun projects and games. Perfect for teens who want to explore coding.",
          learningPoints: [
            "Understand Python syntax",
            "Write small programs and scripts",
            "Create text-based games",
            "Learn problem-solving techniques",
            "Practice computational thinking",
          ],
          outcome:
            "Students will write their own Python programs and simple games, gaining confidence in coding.",
        },
        requirements: ["Computer with Python installed", "Interest in coding"],
      },
      {
        title: "Machine Learning for Kids",
        duration: "3 weeks",
        price: "KSh 3,500",
        focus: ["Games", "Basics", "Problem Solving"],
        level: "Beginner",
        image: ml,
        description: {
          definition:
            "An introduction to machine learning concepts for beginners. Students learn how to train models and create intelligent projects using Python.",
          learningPoints: [
            "Understand what machine learning is",
            "Train simple models",
            "Create games with AI elements",
            "Analyze patterns in data",
            "Explore real-world applications",
          ],
          outcome:
            "Students will be able to implement simple AI projects, fostering interest in artificial intelligence and coding.",
        },
        requirements: [
          "Basic Python knowledge",
          "Computer with Python installed",
        ],
      },
      {
        title: "Python for Kids 2",
        duration: "3 weeks",
        price: "KSh 3,000",
        focus: ["Games", "Basics", "Problem Solving"],
        level: "Beginner",
        image: pythonIcon,
        description: {
          definition:
            "Continue exploring Python programming with more advanced projects. Focus on creating interactive games and solving real problems.",
          learningPoints: [
            "Develop Python games with multiple features",
            "Implement logic and loops",
            "Use functions effectively",
            "Debug and test code",
            "Collaborate on coding challenges",
          ],
          outcome:
            "Students will enhance their Python skills and complete fun projects, preparing for intermediate programming courses.",
        },
        requirements: ["Python for Kids 1", "Basic programming knowledge"],
      },
    ],
  },
];

export default programData;
