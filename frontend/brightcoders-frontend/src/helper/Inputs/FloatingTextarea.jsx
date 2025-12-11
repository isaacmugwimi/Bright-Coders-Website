import React from "react";

export default function FloatingTextarea({
  label,
  name,
  value,
  onChange,
  error,
}) {
  return (
    <div className="input-container textarea-container">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={error?.field === name ? "error-border" : ""}
      />
      <label className="labelline">{label}</label>

      {error?.field === name && (
        <p className="error-message">{error.message}</p>
      )}
    </div>
  );
}
