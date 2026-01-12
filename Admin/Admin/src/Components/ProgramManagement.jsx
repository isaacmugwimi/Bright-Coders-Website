import React, { useEffect, useState, useMemo } from "react";
import { CustomAlerts, Toast } from "../helpers/CustomAlerts/CustomAlerts.jsx";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  FolderOpen,
  X,
  EyeOff,
  Globe,
  ArrowUp,
  Search,
  LayoutGrid,
  Star,
} from "lucide-react";
import "../Css/ProgramManagement.css";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";
import AddCourseForm from "./AddCourseForm/AddCourseForm.jsx";
import { handleWidthDrawCourse } from "../helpers/programManagementFunction.js";
import { useLocation } from "react-router-dom";

const ProgramManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPushingId, setIsPushingId] = useState(null);
  const [isWidthdrawingId, setIsWidthdrawingId] = useState(null);

  // --- NEW FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("total"); // 'total', 'live', 'draft'

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: () => {},
  });

  const [toastConfig, setToastConfig] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message, type = "success") => {
    setToastConfig({ show: true, message, type });
    setTimeout(
      () => setToastConfig((prev) => ({ ...prev, show: false })),
      4000
    );
  };
  const location = useLocation(); // Import useLocation from react-router-dom

  useEffect(() => {
    if (location.state?.openAddModal) {
      handleAddNew();
      // Clear the state so it doesn't reopen on every refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.COURSES.GET_ALL);
      setCourses(response.data);
    } catch (err) {
      triggerToast("Error fetching courses", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (course) => {
    try {
      const newStatus = !course.is_featured;

      await axiosInstance.patch(API_PATHS.COURSES.FEATURED(course.id), {
        isFeatured: newStatus,
      });

      // Update local state immediately for a snappy UI
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, is_featured: newStatus } : c
        )
      );

      triggerToast(
        newStatus ? "Course Featured!" : "Removed from Featured",
        "success"
      );
    } catch (err) {
      triggerToast("Failed to update featured status", "error");
    }
  };

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    const live = courses.filter((c) => c.is_public).length;
    const featured = courses.filter((c) => c.is_featured).length;
    return {
      live,
      featured,
      draft: courses.length - live,
      total: courses.length,
    };
  }, [courses]);

  // --- FILTERING & GROUPING LOGIC ---
  const { groupedCourses, categoryNames } = useMemo(() => {
    // 1. Filter by search and filterMode
    const filtered = courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterMode === "total"
          ? true
          : filterMode === "live"
          ? course.is_public
          : filterMode === "draft"
          ? !course.is_public
          : filterMode === "featured"
          ? course.is_featured
          : true;

      return matchesSearch && matchesFilter;
    });

    // 2. Group the filtered results
    const groups = filtered.reduce((acc, course) => {
      const category = course.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(course);
      return acc;
    }, {});

    return {
      groupedCourses: groups,
      categoryNames: Object.keys(groups).sort(),
    };
  }, [courses, searchTerm, filterMode]);

  // --- ACTION HANDLERS ---
  const handleAddNew = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setAlertConfig({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this course?",
      type: "danger",
      onConfirm: async () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await axiosInstance.delete(API_PATHS.COURSES.DELETE(id));
          setCourses((prev) => prev.filter((course) => course.id !== id));
          triggerToast("Course deleted successfully!", "success");
        } catch (err) {
          triggerToast("Failed to delete", "error");
        }
      },
    });
  };

  const handlePushCourse = (course) => {
    setAlertConfig({
      isOpen: true,
      title: "Push to Live?",
      message: `Make "${course.title}" visible?`,
      type: "info",
      onConfirm: async () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setIsPushingId(course.id);
          const response = await axiosInstance.post(
            API_PATHS.COURSES.PUSH(course.id)
          );
          if (response.status === 200) {
            fetchCourses(); // Refresh list
            triggerToast(`${course.title} is now live!`, "success");
          }
        } catch (error) {
          triggerToast("Failed to push course.", "error");
        } finally {
          setIsPushingId(null);
        }
      },
    });
  };

  const onWithdraw = (course) => {
    setAlertConfig({
      isOpen: true,
      title: "Withdraw from Live?",
      message: `Hide "${course.title}" from public view?`,
      type: "danger",
      onConfirm: async () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await handleWidthDrawCourse(course, setCourses, setIsWidthdrawingId);
          triggerToast(`${course.title} withdrawn`, "success");
        } catch (error) {
          triggerToast("Failed to withdraw", "error");
        }
      },
    });
  };

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(".dashboard-right-section");
    if (scrollContainer)
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="admin-container">
        {/* STATS STRIP */}
        <div className="stats-grid">
          <div
            className={`stat-card ${
              filterMode === "total" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("total")}
          >
            <div className="stat-icon total">
              <LayoutGrid size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Courses</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>
          <div
            className={`stat-card ${
              filterMode === "live" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("live")}
          >
            <div className="stat-icon live">
              <Globe size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Live</span>
              <span className="stat-value">{stats.live}</span>
            </div>
          </div>
          <div
            className={`stat-card featured-stat ${
              filterMode === "featured" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("featured")}
          >
            <div className="stat-icon featured">
              <Star
                size={20}
                fill="#f59e0b"
                stroke="#f59e0b"
                strokeWidth={1.5}
              />
            </div>
            <div className="stat-info">
              <span className="stat-label">Featured</span>
              <span className="stat-value">{stats.featured}</span>
            </div>
          </div>

          <div
            className={`stat-card ${
              filterMode === "draft" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("draft")}
          >
            <div className="stat-icon draft">
              <EyeOff size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Drafts</span>
              <span className="stat-value">{stats.draft}</span>
            </div>
          </div>
        </div>

        <div className="admin-header">
          <div>
            <h1>Program Management</h1>
            <p className="subtitle">Manage catalog by category</p>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-course-btn" onClick={handleAddNew}>
              <Plus size={18} /> Add New Course
            </button>
          </div>
        </div>

        {/* QUICK NAV */}
        {!loading && categoryNames.length > 0 && (
          <nav className="category-quick-nav">
            <span className="nav-label">Jump to:</span>
            <button className="nav-link top-link" onClick={scrollToTop}>
              Top <ArrowUp size={14} />
            </button>
            {categoryNames.map((cat) => (
              <a
                key={cat}
                href={`#cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                className="nav-link"
              >
                {cat}{" "}
                <span className="count-pill">{groupedCourses[cat].length}</span>
              </a>
            ))}
          </nav>
        )}

        {/* SIDEBAR */}
        <button
          className={`fab-nav-toggle ${isSidebarOpen ? "active" : ""}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <FolderOpen size={24} />}
        </button>
        {isSidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <aside className={`category-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h3>Categories</h3>
            <p>{categoryNames.length} Showing</p>
          </div>
          <nav className="sidebar-links">
            {categoryNames.map((cat) => (
              <a
                key={cat}
                href={`#cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                className="sidebar-link"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="cat-name">{cat}</span>
                <span className="cat-count">{groupedCourses[cat].length}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        {loading ? (
          <div className="loading-full-state">
            <Loader2 className="spinner" size={40} />
            <p>Loading your curriculum...</p>
          </div>
        ) : categoryNames.length > 0 ? (
          categoryNames.map((category) => (
            <div
              key={category}
              className="category-section"
              id={`cat-${category.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className="category-header">
                <FolderOpen size={20} className="category-icon" />
                <h2>{category}</h2>
                <span className="item-count">
                  {groupedCourses[category].length} Courses
                </span>
              </div>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="image-head">Image</th>

                      <th className="course-code-head">Code</th>
                      <th className="course-title-head">Course Title</th>

                      <th>Price</th>
                      <th className="status-head">Status</th>
                      <th className="featured-head">
                        {/* <Star size={20} fill="#f59e0b" color="#f59e0b" /> */}
                        Featured
                      </th>
                      <th>Last Pushed</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCourses[category].map((course) => (
                      <tr key={course.id}>
                        <td>
                          <div className="course-img-container">
                            <img
                              src={
                                course.image_url || "/placeholder-course.png"
                              }
                              alt={course.title}
                            />
                          </div>
                        </td>

                        <td className="course-code-cell">
                          <span className="course-code-badge">
                            {course.code || "—"}
                          </span>
                        </td>

                        <td>
                          <span className="course-title-text">
                            {course.title}
                          </span>
                        </td>
                        <td>
                          Ksh.{" "}
                          <span className="price-data">{course.price}</span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              course.is_public ? "public" : "draft"
                            }`}
                          >
                            {course.is_public ? "Live" : "Draft"}
                          </span>
                        </td>
                        <td className="featured-cell">
                          <button
                            className={`star-toggle ${
                              course.is_featured ? "active" : ""
                            }`}
                            onClick={() => handleToggleFeatured(course)}
                            title={
                              course.is_featured
                                ? "Remove from Featured"
                                : "Mark as Featured"
                            }
                            style={{
                              border: "none",
                              background: "transparent",
                            }}
                          >
                            <Star
                              size={20}
                              fill={course.is_featured ? "#f59e0b" : "grey"}
                              color={course.isFeatured ? "#f59e0b" : ""}
                            />
                          </button>
                        </td>
                        <td>
                          <span className="sync-time">
                            {course.last_pushed_at
                              ? new Date(
                                  course.last_pushed_at
                                ).toLocaleDateString()
                              : "Never"}
                          </span>
                        </td>

                        <td>
                          <div className="action-btns">
                            {course.is_public ? (
                              <button
                                className="withdraw-btn"
                                onClick={() => onWithdraw(course)}
                                disabled={isWidthdrawingId === course.id}
                              >
                                {isWidthdrawingId === course.id ? (
                                  <Loader2 size={16} className="spinner" />
                                ) : (
                                  <EyeOff size={16} />
                                )}
                              </button>
                            ) : (
                              <button
                                className="push-row-btn"
                                onClick={() => handlePushCourse(course)}
                                disabled={isPushingId !== null}
                              >
                                {isPushingId === course.id ? (
                                  <Loader2 size={16} className="spinner" />
                                ) : (
                                  <Globe size={16} />
                                )}
                              </button>
                            )}
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(course)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(course.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-card">
            <p>No courses found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* SHARED COMPONENTS */}
      <CustomAlerts
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {toastConfig.show && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig((prev) => ({ ...prev, show: false }))}
        />
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedCourse ? "Edit Course" : "Add New Course"}</h2>
              <button className="close-x" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <AddCourseForm
              onClose={() => setIsModalOpen(false)}
              refreshCourses={fetchCourses}
              initialData={selectedCourse}
              existingCategories={categoryNames}
              triggerToast={triggerToast}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProgramManagement;
