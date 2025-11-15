import React from "react";
import QRCode from "react-qr-code";

export default function QRCodeModal({ open, onClose, value }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "320px",
          maxWidth: "90vw",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Event QR Code</h2>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <QRCode value={value} size={200} />
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#111827",
            color: "white",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}