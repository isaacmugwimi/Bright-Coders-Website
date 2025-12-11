// import React from "react";
// import "../Css/CurriculumModal.css";
// import { motion } from "framer-motion";
// import { FaTimes } from "react-icons/fa";

// const dropIn = {
//   hidden: { opacity: 0, scale: 0.8 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: { duration: 0.3 },
//   },
//   exit: { opacity: 0, scale: 0.8 },
// };

// const CurriculumModal = ({ program, closeModal }) => {
//   return (
//     <div className="modal-overlay" onClick={closeModal}>
//       <motion.div
//         className="modal-content"
//         variants={dropIn}
//         initial="hidden"
//         animate="visible"
//         exit="exit"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="modal-header">
//           <h2>{program.title} Curriculum</h2>
//           <FaTimes className="close-icon" onClick={closeModal} />
//         </div>

//         <p className="modal-grade">{program.grade}</p>

//         <ul className="curriculum-list">
//           {program.curriculum.map((item, index) => (
//             <li key={index} className="curriculum-item">
//               {item}
//             </li>
//           ))}
//         </ul>

//         <button className="close-btn" onClick={closeModal}>
//           Close
//         </button>
//       </motion.div>
//     </div>
//   );
// };

// export default CurriculumModal;
