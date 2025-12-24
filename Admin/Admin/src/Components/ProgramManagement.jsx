import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"; // Fixed: Added Loader2
import "../Css/ProgramManagement.css";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";
import DashBoardLayout from "../Layouts/DashBoardLayout.jsx";
import AddCourseForm from "./AddCourseForm/AddCourseForm.jsx";

const ProgramManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Open modal for Adding
  const handleAddNew = () => {
    setSelectedCourse(null); // Clear previous selection
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleEdit = (course) => {
    setSelectedCourse(course); // Put the clicked course into state
    setIsModalOpen(true);
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.COURSES.GET_ALL);
      setCourses(response.data);
    } catch (err) {
      console.error("Error Fetching Courses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axiosInstance.delete(API_PATHS.COURSES.DELETE(id));
      // Optimistic UI update: Remove from state immediately
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      alert("Failed to delete the course. Please try again.");
    }
  };

  return (
    <>
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Course Management</h1>
            <p className="subtitle">Manage and sync your program catalog</p>
          </div>
          <button
            className="add-course-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Add New Course
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Course Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-cell">
                    <div className="loading-container">
                      <Loader2 className="spinner" />
                      <span>Loading Courses...</span>
                    </div>
                  </td>
                </tr>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="course-img-container">
                        <img
                          src={course.image_url || "/placeholder-course.png"}
                          alt={course.title}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="course-title-text">{course.title}</span>
                    </td>
                    <td>{course.category}</td>
                    <td>{course.price}</td>
                    <td>
                      <span
                        className={`badge ${
                          course.is_public ? "public" : "draft"
                        }`}
                      >
                        {course.is_public ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="edit-btn"
                          title="Edit"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="delete-btn"
                          title="Delete"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No courses found. Click "Add New Course" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              {/* Change title based on whether we are editing or adding */}
              <h2>{selectedCourse ? "Edit Course" : "Add New Course"}</h2>
              <button className="close-x" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            {/* The AddCourseForm will go here */}
            <AddCourseForm
              onClose={() => setIsModalOpen(false)}
              refreshCourses={fetchCourses}
              initialData={selectedCourse}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProgramManagement;
