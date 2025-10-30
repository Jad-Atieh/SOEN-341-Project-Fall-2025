import React from "react";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">x</button>
        </div>

        <div className="mb-4">{children}</div>

        {actions && (
        <div className="flex justify-end gap-2">
            {actions.map((action, i) => (
            <button
                key={i}
                onClick={action.onClick}
                className="px-4 py-2 rounded-md bg-gray-200 text-black"
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
