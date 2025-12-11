import React from "react";

export default function FloatingInput({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  required = false,
}) {
  return (
    <div className="input-container">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error?.field === name ? "error-border" : ""}
      />
      <label className="labelline">{label}</label>

      {error?.field === name && (
        <p className="error-message">{error.message}</p>
      )}
    </div>
  );
}
