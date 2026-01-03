import React, { useEffect, useState, useMemo } from "react";
import {
  CustomAlerts,
  Toast,
} from "../../helpers/CustomAlerts/CustomAlerts.jsx";
import {
  Trash2,
  Loader2,
  FileText,
  Search,
  LayoutGrid,
  CheckCircle,
  Clock,
  UserCheck,
  CreditCard,
  Download,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import "../AdminBlogManager/AdminBlogManager.css"; // Reuse your existing CSS
import { RegistrationDetailsModal } from "./RegistrationDetailsModal/RegistrationDetailsModal.jsx";
import { getAllRegistrations } from "../../services/generalServices.js";

const AdminRegistrationManager = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Filter Modes: 'total', 'paid', or 'pending'
  const [filterMode, setFilterMode] = useState("total");

  const [isUpdatingId, setIsUpdatingId] = useState(null);

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
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getAllRegistrations();
      setRegistrations(data);
    } catch (err) {
      triggerToast("Error fetching registrations", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- STATS ---
  const stats = useMemo(() => {
    const paid = registrations.filter(
      (r) => r.payment_status === "paid"
    ).length;
    const awaiting = registrations.filter(
      (r) => r.payment_status === "awaiting_verification"
    ).length;
    return {
      total: registrations.length,
      paid,
      pending: registrations.length - paid,
      awaiting,
    };
  }, [registrations]);

  // --- FILTERING ---
  const filteredData = useMemo(() => {
    let result = registrations.filter(
      (reg) =>
        reg.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterMode === "paid") {
      return result.filter((r) => r.payment_status === "paid");
    } else if (filterMode === "pending") {
      return result.filter((r) => r.payment_status !== "paid");
    }

    return result;
  }, [registrations, searchTerm, filterMode]);

  const handleDelete = (id) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Registration?",
      message: "This action is permanent. Delete this record?",
      type: "danger",
      onConfirm: async () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await axiosInstance.delete(API_PATHS.REGISTRATIONS.DELETE(id));
          setRegistrations((prev) => prev.filter((r) => r.id !== id));
          triggerToast("Record deleted successfully!", "success");
        } catch (err) {
          triggerToast("Failed to delete", "error");
        }
      },
    });
  };

  const handleVerifyPayment = (reg) => {
    let finalMpesaCode = reg.mpesa_code;

    if (reg.mpesa_code === "PAY_LATER") {
      const newCode = window.prompt(
        `Enter the M-Pesa transaction code for ${reg.child_name}:`
      );

      if (!newCode || newCode.trim() === "") {
        triggerToast(
          "Verification cancelled. A valid code is required.",
          "info"
        );
        return;
      }
      finalMpesaCode = newCode.toUpperCase().trim();
    }

    setAlertConfig({
      isOpen: true,
      title: "Verify Payment?",
      message: `Confirm payment for ${reg.child_name} (ID: ${reg.registration_number}) with Code: ${finalMpesaCode}?`,
      type: "info",
      onConfirm: async () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        setIsUpdatingId(reg.id);
        try {
          await axiosInstance.patch(
            API_PATHS.REGISTRATIONS.UPDATE_PAYMENT(reg.id),
            {
              paymentStatus: "paid",
              mpesaCode: finalMpesaCode,
              receiptStatus: "sent",
            }
          );
          triggerToast(
            "Payment Verified, Receipt Sent & Code Updated!",
            "success"
          );
          fetchRegistrations();
        } catch (error) {
          triggerToast("Verification failed.", "error");
        } finally {
          setIsUpdatingId(null);
        }
      },
    });
  };

  return (
    <>
      <div className="admin-container">
        {/* STATS GRID */}
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
              <span className="stat-label">Total Registered</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>

          <div
            className={`stat-card ${
              filterMode === "paid" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("paid")}
          >
            <div className="stat-icon live">
              <CheckCircle size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Paid Students</span>
              <span className="stat-value">{stats.paid}</span>
            </div>
          </div>

          <div
            className={`stat-card ${
              filterMode === "pending" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("pending")}
          >
            <div className="stat-icon draft">
              <Clock size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Unpaid / Pending</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
          </div>
        </div>

        <div className="admin-header">
          <div>
            <h1>Student Registrations</h1>
            <p className="subtitle">
              Manage enrollment and payment verification
            </p>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-full-state">
            <Loader2 className="spinner" size={40} />
            <p>Fetching student records...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="category-section">
            <div className="category-header">
              <UserCheck size={20} className="category-icon" />
              <h2 style={{ textTransform: "capitalize" }}>
                {filterMode} Records
              </h2>
              <span className="item-count">{filteredData.length} Students</span>
            </div>

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reg ID</th>
                    <th>Student Details</th>
                    <th>Course</th>
                    <th>M-Pesa Code</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <span
                          className="course-title-text"
                          style={{ fontSize: "0.85rem", fontWeight: "bold" }}
                        >
                          {reg.registration_number}
                        </span>
                      </td>
                      <td>
                        <div
                          className="name-cell"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span className="course-title-text">
                            {reg.child_name}
                          </span>
                          <small style={{ color: "#666" }}>
                            {reg.parent_phone}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className="sync-time">{reg.course_name}</span>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <CreditCard size={14} color="#666" />
                          <code
                            style={{
                              background:
                                reg.mpesa_code === "PAY_LATER"
                                  ? "#fff3cd"
                                  : "#f0f0f0",
                              color:
                                reg.mpesa_code === "PAY_LATER"
                                  ? "#856404"
                                  : "#333",
                              padding: "2px 5px",
                              borderRadius: "4px",
                              fontWeight:
                                reg.mpesa_code === "PAY_LATER"
                                  ? "bold"
                                  : "normal",
                              border:
                                reg.mpesa_code === "PAY_LATER"
                                  ? "1px solid #ffeeba"
                                  : "none",
                            }}
                          >
                            {reg.mpesa_code}
                          </code>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            reg.payment_status === "paid" ? "public" : "draft"
                          }`}
                        >
                          {reg.payment_status.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          {reg.payment_status !== "paid" && (
                            <button
                              className="push-row-btn"
                              title="Verify Payment"
                              onClick={() => handleVerifyPayment(reg)}
                              disabled={isUpdatingId === reg.id}
                            >
                              {isUpdatingId === reg.id ? (
                                <Loader2 size={16} className="spinner" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </button>
                          )}
                          <button
                            className="edit-btn"
                            title="View Details"
                            onClick={() => setSelectedRegistration(reg)}
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(reg.id)}
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
        ) : (
          <div className="empty-state-card">
            <p>No registration records found.</p>
          </div>
        )}

        {selectedRegistration && (
          <RegistrationDetailsModal
            registration={selectedRegistration}
            onClose={() => setSelectedRegistration(null)}
          />
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

export default AdminRegistrationManager;
