import { AlertCircle, CheckCircle2, X } from "lucide-react";
import React from "react";
import "./CustomAlerts.css";

// --- CONFIRMATION MODAL ---
export const CustomAlerts = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type = "danger",
  children, 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-custom-overlay custom-alert-overlay">
      <div className="alert-box">
        <div className="alert-icon-header">
          <AlertCircle
            size={40}
            color={type === "danger" ? "#ef4444" : "#3b82f6"}
          />

          <h3>{title}</h3>
          <p>{message}</p>

          {/* 🔥 INJECT CUSTOM CONTENT */}
          {children && (
            <div className="alert-custom-body">
              {children}
            </div>
          )}

          <div className="alert-actions">
            <button className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button
              className={type === "danger" ? "delete-btn" : "add-course-btn"}
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TOAST NOTIFICATION ---
export const Toast = ({ message, type = "success", onClose }) => {
  return (
    <div className={`toast-notification ${type}`}>
      {type === "success" ? (
        <CheckCircle2 size={18} />
      ) : (
        <AlertCircle size={18} />
      )}
      <span>{message}</span>
      <button onClick={onClose}>
        <X size={14} />
      </button>
      <div className="toast-progress-bar"></div>
    </div>
  );
};
