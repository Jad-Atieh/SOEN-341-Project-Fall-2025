import React, { useState } from "react";
import OrganizerApproval from "./OrganizerApproval";
import EventModeration from "./EventModeration";
import GlobalAnalytics from "./GlobalAnalytics";
import "../../styles/style.css"; // keep this if your CSS file exists

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("organizers");

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="tab-buttons">
        <button onClick={() => setActiveTab("organizers")}>Organizer Approval</button>
        <button onClick={() => setActiveTab("events")}>Event Moderation</button>
        <button onClick={() => setActiveTab("analytics")}>Global Analytics</button>
      </div>

      <div className="tab-content">
        {activeTab === "organizers" && <OrganizerApproval />}
        {activeTab === "events" && <EventModeration />}
        {activeTab === "analytics" && <GlobalAnalytics />}
      </div>
    </div>
  );
};

export default AdminDashboard;
