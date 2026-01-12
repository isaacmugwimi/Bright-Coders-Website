import React, { useState, useMemo } from "react";
import {
  X,
  CreditCard,
  Banknote,
  AlertTriangle,
  User,
  Info,
  CheckCircle2,
} from "lucide-react";
import "./PaymentModal.css";

export const PaymentModal = ({ registration, onClose, onConfirm, loading }) => {
  const isAwaiting = registration.payment_status === "awaiting_verification";
  const totalCoursePrice = parseFloat(registration.total_course_price);
  const trueLimit = isAwaiting
    ? totalCoursePrice
    : parseFloat(registration.balance_due);

  const [mpesaCode, setMpesaCode] = useState(
    registration.mpesa_code === "PAY_LATER" ? "" : registration.mpesa_code || ""
  );
  const [amount, setAmount] = useState(
    isAwaiting ? registration.amount_paid : registration.balance_due
  );

  const validation = useMemo(() => {
    const mpesaRegex = /^[A-Z0-9]{10}$/;
    const isMpesaValid = mpesaRegex.test(mpesaCode.trim());
    const numAmount = parseFloat(amount) || 0;
    const overpaidAmount = numAmount > trueLimit;
    return {
      isMpesaValid,
      isAmountValid: numAmount > 0 && !overpaidAmount,
      overpaidAmount,
      canSubmit: isMpesaValid && numAmount > 0 && !overpaidAmount && !loading,
    };
  }, [mpesaCode, amount, trueLimit, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validation.canSubmit) onConfirm(mpesaCode.trim(), parseFloat(amount));
  };

  return (
    <div className="modal-overlay1">
      <div className="modal-content1" style={{ maxWidth: "420px" }}>
        <div className="modal-header1">
          <h3>Verify Transaction</h3>
          <button onClick={onClose} className="close-btn" disabled={loading}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body1">
          {/* Enhanced Summary Card */}
          <div className="registration-summary">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <User size={16} className="icon-cyan" />
              <span style={{ fontWeight: 700, color: "#1e293b" }}>
                {registration.child_name}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              <Info size={14} />
              <span>
                Course Total:{" "}
                <strong>Ksh {totalCoursePrice.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          {/* M-Pesa Input Group */}
          <div className="form-group">
            <label>
              <CreditCard size={22} className="icon-cyan" /> M-Pesa Transaction
              ID
            </label>
            <input
              type="text"
              value={mpesaCode}
              onChange={(e) =>
                setMpesaCode(e.target.value.toUpperCase().replace(/\s/g, ""))
              }
              placeholder="e.g. SAK45T6Y78"
              maxLength={10}
              className={`admin-input ${
                mpesaCode.length > 0 && !validation.isMpesaValid
                  ? "input-error"
                  : ""
              }`}
            />

            {/* Transaction ID Feedback Label */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "4px",
              }}
            >
              <small
                style={{
                  color: validation.isMpesaValid ? "#059669" : "#64748b",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {validation.isMpesaValid ? (
                  <>
                    <CheckCircle2 size={19} /> Valid Format
                  </>
                ) : (
                  `Characters: ${mpesaCode.length}/10`
                )}
              </small>

              {mpesaCode.length > 0 && !validation.isMpesaValid && (
                <small
                  className="error-text"
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <AlertTriangle size={12} /> Must be 10 characters
                </small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>
              <Banknote size={22} className="icon-cyan" /> Payment Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`admin-input ${
                validation.overpaidAmount ? "input-error" : ""
              }`}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              <small style={{ color: "#008b8b", fontWeight: "700" }}>
                Max Limit: Ksh {trueLimit.toLocaleString()}
              </small>
              {validation.overpaidAmount && (
                <small
                  className="error-text"
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <AlertTriangle size={14} className="icon-orange" /> Limit
                  Exceeded!
                </small>
              )}
            </div>
          </div>

          <div
            className="modal-footer1"
            style={{ display: "flex", gap: "12px" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={loading}
            >
              Discard
            </button>
            <button
              type="submit"
              className="confirm-btn"
              disabled={!validation.canSubmit}
            >
              {loading ? "Syncing..." : "Verify Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
