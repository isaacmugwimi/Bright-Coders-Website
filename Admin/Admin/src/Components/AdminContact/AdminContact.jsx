import React, { useEffect, useState, useMemo } from "react";
import {
  CustomAlerts,
  Toast,
} from "../../helpers/CustomAlerts/CustomAlerts.jsx";
import {
  Trash2,
  Loader2,
  Mail,
  MailOpen,
  Reply,
  Search,
  CheckCircle,
  Inbox,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import "../AdminBlogManager/AdminBlogManager.css"; // Reuse existing layout styles
import "./AdminContact.css"; // Specific styles for contact manager

const AdminContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("total"); // 'total', 'unread', 'read', 'replied'
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
    setTimeout(() => setToastConfig((prev) => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.CONTACTS.GET_ALL);
      setContacts(response.data);
    } catch (err) {
      triggerToast("Error fetching messages", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- STATS ---
  const stats = useMemo(() => ({
    unread: contacts.filter((c) => c.status === "unread").length,
    replied: contacts.filter((c) => c.status === "replied").length,
    total: contacts.length,
  }), [contacts]);

  // --- FILTERING ---
  const filteredData = useMemo(() => {
    let result = contacts.filter(
      (c) =>
        c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterMode !== "total") {
      result = result.filter((c) => c.status === filterMode);
    }

    return result;
  }, [contacts, searchTerm, filterMode]);

  const handleDelete = (id) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Message?",
      message: "This will permanently remove this inquiry. Proceed?",
      type: "danger",
      onConfirm: async () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await axiosInstance.delete(API_PATHS.CONTACTS.DELETE(id));
          setContacts((prev) => prev.filter((c) => c.id !== id));
          triggerToast("Message deleted", "success");
        } catch (err) {
          triggerToast("Failed to delete", "error");
        }
      },
    });
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setIsProcessingId(id);
      await axiosInstance.patch(API_PATHS.CONTACTS.UPDATE_STATUS(id), { status: newStatus });
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      triggerToast(`Marked as ${newStatus}`, "success");
    } catch (error) {
      triggerToast("Failed to update status", "error");
    } finally {
      setIsProcessingId(null);
    }
  };

  return (
    <>
      <div className="admin-container">
        {/* STATS STRIP */}
        <div className="stats-grid">
          <div className={`stat-card ${filterMode === "total" ? "active-filter" : ""}`} onClick={() => setFilterMode("total")}>
            <div className="stat-icon total"><Inbox size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Total Inquiries</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>

          <div className={`stat-card ${filterMode === "unread" ? "active-filter" : ""}`} onClick={() => setFilterMode("unread")}>
            <div className="stat-icon draft"><Mail size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Unread</span>
              <span className="stat-value">{stats.unread}</span>
            </div>
          </div>

          <div className={`stat-card ${filterMode === "replied" ? "active-filter" : ""}`} onClick={() => setFilterMode("replied")}>
            <div className="stat-icon live"><Reply size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Replied</span>
              <span className="stat-value">{stats.replied}</span>
            </div>
          </div>
        </div>

        <div className="admin-header">
          <div>
            <h1>Contact Inquiries</h1>
            <p className="subtitle">Manage messages from potential students and partners</p>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search name, email or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-full-state">
            <Loader2 className="spinner" size={40} />
            <p>Loading messages...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Message Content</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="font-bold">{c.full_name}</div>
                      <div className="text-muted small">{c.email}</div>
                    </td>
                    <td className="message-cell">
                      <p className="truncate-text" style={{ maxWidth: '300px' }}>{c.message}</p>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${c.status}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        {c.status === 'unread' && (
                          <button 
                            className="push-row-btn" 
                            title="Mark as Read"
                            onClick={() => handleUpdateStatus(c.id, 'read')}
                            disabled={isProcessingId === c.id}
                          >
                            <MailOpen size={16} />
                          </button>
                        )}
                        {c.status !== 'replied' && (
                          <button 
                            className="edit-btn" 
                            title="Mark as Replied"
                            onClick={() => handleUpdateStatus(c.id, 'replied')}
                            disabled={isProcessingId === c.id}
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button className="delete-btn" onClick={() => handleDelete(c.id)}>
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
            <p>No messages found.</p>
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

export default AdminContactManager;