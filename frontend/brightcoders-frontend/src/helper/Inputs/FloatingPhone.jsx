import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function FloatingPhone({
  label,
  name,
  value,
  onChange,
  error,
}) {
  return (
    <div className="input-container phone-input-container">
      <PhoneInput
        country={"ke"}
        value={value}
        onChange={(phone) => onChange(name, phone)}
        inputStyle={{
          width: "100%",
          padding: "12px 50px",
          border: "none",
          background: "transparent",
        }}
        buttonStyle={{
          border: "none",
          background: "transparent",
        }}
        containerStyle={{
          width: "100%",
        }}
      />

      <label className="labelline">{label}</label>

      {error?.field === name && (
        <p className="error-message">{error.message}</p>
      )}
    </div>
  );
}
