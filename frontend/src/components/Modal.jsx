import React from "react";
import "../styles/Modal.css"; 

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-btn">x</button>
        </div>

        <div className="modal-body">{children}</div>

        {actions && (
          <div className="modal-actions">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`btn ${action.type}`} // 'primary' or 'secondary'
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
