import React, { useState } from "react";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import { Plus, Edit, Trash2 } from "lucide-react";
import "../Css/ProgramManagement.css";

const ProgramManagement = () => {
  // In a real app, you would fetch this from your backend
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    sendToWebsite: true,
  });

  const fetchCourses = async () => {
    try {
      const response = await axios.get("YOUR_API_ENDPOINT/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error Fetching Courses");
    }
  };
  // Run on button click or page load
  const handleLoadData = () => {
    fetchCourses();
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Course Management</h1>
        <button className="add-course-btn">
          <Plus size={18} /> Add New Course
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Course Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td>
                  <img src={course.image} width="50" alt="" />
                </td>
                <td>{course.title}</td>
                <td>{course.category}</td>
                <td>{course.price}</td>
                <td>
                  <button className="edit-btn">
                    <Edit size={16} />
                  </button>
                  <button className="delete-btn">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No courses found. Start by adding one!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProgramManagement;
