import React from "react";

const Tabs = ({ tabs, active, onChange }) => {
  return (
    <div className="organizer-buttons">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`organizer-buttons-button ${active === tab ? "active" : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
