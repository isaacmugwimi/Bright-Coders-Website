import React from "react";

export default function FloatingSelect({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  children
}) {
  return (
    <div className="input-container">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error?.field === name ? "error-border" : ""}
      >
        <option value=""></option>
        {children}
      </select>

      <label className="labelline">{label}</label>

      {error?.field === name && (
        <p className="error-message">{error.message}</p>
      )}
    </div>
  );
}
