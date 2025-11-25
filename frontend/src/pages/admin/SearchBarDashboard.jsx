import React from "react";

export default function SearchBarDashboard({ value, onChange, placeholder }) {
  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "12px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s",
  },
};
