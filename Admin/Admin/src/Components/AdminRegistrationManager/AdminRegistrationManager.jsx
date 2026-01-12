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
  UserCheck,
  CreditCard,
  Wallet,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import "../AdminBlogManager/AdminBlogManager.css";
import { RegistrationDetailsModal } from "./RegistrationDetailsModal/RegistrationDetailsModal.jsx";
import { getAllRegistrations } from "../../services/generalServices.js";
import { PaymentModal } from "../../helpers/CustomAlerts/PaymentModal.jsx";

const AdminRegistrationManager = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filterMode, setFilterMode] = useState("total");
  const [isUpdatingId, setIsUpdatingId] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState(null);

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

  // --- STATS LOGIC ---
  const stats = useMemo(() => {
    const paid = registrations.filter(
      (r) => r.payment_status === "paid"
    ).length;
    const partial = registrations.filter(
      (r) => r.payment_status === "partial"
    ).length;
    const pending = registrations.filter(
      (r) =>
        r.payment_status === "pending" ||
        r.payment_status === "awaiting_verification"
    ).length;

    const totalCollected = registrations.reduce(
      (acc, r) => acc + (parseFloat(r.amount_paid) || 0),
      0
    );
    const totalDebt = registrations.reduce(
      (acc, r) => acc + (parseFloat(r.balance_due) || 0),
      0
    );

    return {
      total: registrations.length,
      paid,
      partial,
      pending,
      totalCollected,
      totalDebt,
    };
  }, [registrations]);

  // --- FILTERING ---
  const filteredData = useMemo(() => {
    let result = registrations.filter(
      (reg) =>
        reg.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterMode === "paid")
      return result.filter((r) => r.payment_status === "paid");
    if (filterMode === "partial")
      return result.filter((r) => r.payment_status === "partial");
    if (filterMode === "pending")
      return result.filter((r) => r.payment_status !== "paid");

    return result;
  }, [registrations, searchTerm, filterMode]);

  // --- CORE PAYMENT VERIFICATION LOGIC ---
const handleVerifyPayment = (reg) => {
  setPaymentModalData(reg); // This opens the modal
};

// This function is called by the Modal when the user clicks "Confirm"
const executePaymentUpdate = async (finalMpesaCode, confirmedAmount) => {
  const reg = paymentModalData;
  const isAwaiting = reg.payment_status === "awaiting_verification";

  setIsUpdatingId(reg.id);
  try {
    await axiosInstance.patch(API_PATHS.REGISTRATIONS.UPDATE_PAYMENT(reg.id), {
      confirmedAmount: parseFloat(confirmedAmount),
      mpesaCode: finalMpesaCode.toUpperCase().trim(),
      isVerifyingExisting: isAwaiting,
    });
    
    triggerToast("Payment confirmed successfully!", "success");
    setPaymentModalData(null); // Close modal
    fetchRegistrations(); // Refresh list
  } catch (error) {
    triggerToast(error.response?.data?.message || "Update failed.", "error");
  } finally {
    setIsUpdatingId(null);
  }
};


  const handleDelete = (id) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete Record?",
      message: "This cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await axiosInstance.delete(API_PATHS.REGISTRATIONS.DELETE(id));
          setRegistrations((prev) => prev.filter((r) => r.id !== id));
          triggerToast("Deleted successfully!");
        } catch (err) {
          triggerToast("Delete failed", "error");
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
              <span className="stat-label">Total</span>
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
              <span className="stat-label">Fully Paid</span>
              <span className="stat-value">{stats.paid}</span>
            </div>
          </div>
          <div
            className={`stat-card ${
              filterMode === "partial" ? "active-filter" : ""
            }`}
            onClick={() => setFilterMode("partial")}
          >
            <div
              className="stat-icon draft" 
              style={{ backgroundColor: "#E0F2F2" }}
            >
              <Wallet size={20} color="#008B8B"/>
            </div>
            <div className="stat-info">
              <span className="stat-label">Installments</span>
              <span className="stat-value">{stats.partial}</span>
            </div>
          </div>
          <div
            className="stat-card"
            style={{ cursor: "default", borderLeft: "4px solid #e74c3c" }}
          >
            <div
              className="stat-icon draft"
              style={{ backgroundColor: "#fdeaea", color: "#e74c3c" }}
            >
              <AlertCircle size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Debt</span>
              <span className="stat-value">
                Ksh {stats.totalDebt.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-header">
          <div>
            <h1>Student Registrations</h1>
            <p className="subtitle">Real-time tracking of student registrations and payment progress.</p>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-full-state">
            <Loader2 className="spinner" size={40} />
            <p>Loading records...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reg ID</th>
                  <th>Student & Balance</th>
                  <th>Course</th>
                  <th>M-Pesa / Paid</th>
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
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="course-title-text">
                          {reg.child_name}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color:
                              parseFloat(reg.balance_due) > 0
                                ? "#e74c3c"
                                : "#2ecc71",
                            fontWeight: "bold",
                          }}
                        >
                          Bal: Ksh{" "}
                          {parseFloat(reg.balance_due || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="sync-time">{reg.course_name}</span>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "11px",
                            color:
                              reg.mpesa_code === "PAY_LATER"
                                ? "#e74c3c"
                                : "inherit",
                          }}
                        >
                          <CreditCard size={12} /> {reg.mpesa_code}
                        </div>
                        <small style={{ color: "#666" }}>
                          Paid: {parseFloat(reg.amount_paid).toLocaleString()}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          reg.payment_status === "paid"
                            ? "public"
                            : reg.payment_status === "awaiting_verification"
                            ? "warning"
                            : reg.payment_status === "partial"
                            ? "live"
                            : "draft"
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
        )}

        {selectedRegistration && (
          <RegistrationDetailsModal
            registration={selectedRegistration}
            onClose={() => setSelectedRegistration(null)}
          />
        )}
      </div>


      {paymentModalData && (
  <PaymentModal
    registration={paymentModalData}
    loading={isUpdatingId === paymentModalData.id}
    onClose={() => setPaymentModalData(null)}
    onConfirm={executePaymentUpdate}
  />
)}

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
