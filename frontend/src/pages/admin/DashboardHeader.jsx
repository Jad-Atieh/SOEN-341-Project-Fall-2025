import React from "react";

const DashboardHeader = () => {
  return (
    <header className="header">
      <div className="title-wrap">
        <span className="logo">🛡</span>
        <h1 className="title">Admin Dashboard</h1>
        <span className="badge">Admin Only</span>
      </div>

      <button className="logout">↪ Sign out</button>
    </header>
  );
};

export default DashboardHeader;
