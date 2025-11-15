import React from "react";
import QRCode from "react-qr-code";

export default function QRCodeModal({ event, value, onClose }) {
  if (!event) return null;

  return (
    <div className="qr-modal-backdrop" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h3>Check-in QR code</h3>
          <button className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>
        <p className="qr-modal-subtitle">
          Scan this code at the entrance to check in attendees for
          <span className="qr-event-name"> {event.name}</span>.
        </p>
        <div className="qr-modal-body">
          {value ? (
            <QRCode value={value} size={180} />
          ) : (
            <p className="helper-text">No QR data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}