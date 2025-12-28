import React, { useEffect, useState, useMemo } from "react";
import {
  CustomAlerts,
  Toast,
} from "../../helpers/CustomAlerts/CustomAlerts.jsx";
import {
  Trash2,
  Loader2,
  MessageSquare,
  EyeOff,
  CheckCircle,
  Search,
  Star,
  UserCheck,
  UserX,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import "../AdminBlogManager/AdminBlogManager.css";
import "./AdminTestimonialManager.css";

const AdminTestimonialManager = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("total"); // 'total', 'approved', 'pending'

  const [isProcessingId, setIsProcessingId] = useState(null);

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

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.TESTIMONIALS.GET_ALL);
      setTestimonials(response.data);
    } catch (err) {
      triggerToast("Error fetching testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- STATS ---
  const stats = useMemo(() => {
    const approved = testimonials.filter((t) => t.is_approved).length;
    return {
      approved,
      pending: testimonials.length - approved,
      total: testimonials.length,
    };
  }, [testimonials]);

  // --- FILTERING ---
  const filteredData = useMemo(() => {
    let result = testimonials.filter(
      (t) =>
        t.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterMode === "approved") return result.filter((t) => t.is_approved);
    if (filterMode === "pending") return result.filter((t) => !t.is_approved);

    return result;
  }, [testimonials, searchTerm, filterMode]);

  const handleDelete = (id) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Testimonial?",
      message: "This action cannot be undone. Delete this feedback?",
      type: "danger",
      onConfirm: async () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await axiosInstance.delete(API_PATHS.TESTIMONIALS.DELETE(id));
          setTestimonials((prev) => prev.filter((t) => t.id !== id));
          triggerToast("Deleted successfully!", "success");
        } catch (err) {
          triggerToast("Failed to delete", "error");
        }
      },
    });
  };

  const handleToggleApproval = (testimonial) => {
    const isApproved = testimonial.is_approved;
    setAlertConfig({
      isOpen: true,
      title: isApproved ? "Hide Testimonial?" : "Approve Testimonial?",
      message: `Set "${testimonial.user_name}'s" feedback to ${
        isApproved ? "Hidden" : "Live"
      }?`,
      type: isApproved ? "danger" : "success",
      onConfirm: async () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setIsProcessingId(testimonial.id);
          const path = isApproved
            ? API_PATHS.TESTIMONIALS.HIDE(testimonial.id)
            : API_PATHS.TESTIMONIALS.APPROVE(testimonial.id);

          await axiosInstance.post(path);
          triggerToast(isApproved ? "Hidden" : "Approved and Live", "success");
          fetchTestimonials();
        } catch (error) {
          triggerToast("Action failed.", "error");
        } finally {
          setIsProcessingId(null);
        }
      },
    });
  };

  return (
    <>
      <div className="admin-container">
        {/* MODERATION STATS */}
        <div className="stats-grid">
          <div
            className={`stat-card ${
              filterMode === "total" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("total")}
          >
            <div className="stat-icon total">
              <MessageSquare size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Reviews</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>

          <div
            className={`stat-card ${
              filterMode === "approved" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("approved")}
          >
            <div className="stat-icon live">
              <UserCheck size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Live on Site</span>
              <span className="stat-value">{stats.approved}</span>
            </div>
          </div>

          <div
            className={`stat-card ${
              filterMode === "pending" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("pending")}
          >
            <div className="stat-icon draft">
              <UserX size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pending Review</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
          </div>
        </div>

        <div className="admin-header">
          <div>
            <h1>Testimonial Moderation</h1>
            <p className="subtitle">Review and manage student feedback</p>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by name or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-full-state">
            <Loader2 className="spinner" size={40} />
            <p>Loading feedback...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Message</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-profile-cell">
                          <img
                            src={
                              t.image_url
                                ? t.image_url.startsWith("http")
                                  ? t.image_url
                                  : `${API_URL.replace(
                                      /\/$/,
                                      ""
                                    )}/${t.image_url.replace(/^\//, "")}`
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    t.user_name
                                  )}`
                            }
                            className="avatar-sm"
                            alt={t.user_name}
                          />
                          {/* ... rest of your code ... */}
                        </div>
                        <div>
                          <div className="font-bold">{t.user_name}</div>
                          <div className="text-muted small">{t.user_role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="message-cell">
                      <p className="truncate-text">{t.message}</p>
                    </td>
                    <td>
                      <div className="rating-stars">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill="#ffc107"
                            color="#ffc107"
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          t.is_approved ? "public" : "draft"
                        }`}
                      >
                        {t.is_approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className={
                            t.is_approved ? "withdraw-btn" : "push-row-btn"
                          }
                          onClick={() => handleToggleApproval(t)}
                          disabled={isProcessingId === t.id}
                        >
                          {isProcessingId === t.id ? (
                            <Loader2 size={16} className="spinner" />
                          ) : t.is_approved ? (
                            <EyeOff size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(t.id)}
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
        ) : (
          <div className="empty-state-card">
            <p>No testimonials found in this category.</p>
          </div>
        )}
      </div>

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
    </>
  );
};

export default AdminTestimonialManager;
