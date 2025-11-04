import React from "react";

const Tabs = ({ tabs, active, onChange }) => {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`tab-btn ${active === tab ? "active" : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
