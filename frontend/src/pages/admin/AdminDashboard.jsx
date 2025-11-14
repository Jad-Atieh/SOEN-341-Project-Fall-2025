import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Tabs from "./Tabs";
import SearchBar from "./SearchBar";
import EventsGrid from "./EventsGrid";
import OrganizerTable from "./OrganizerTable";
import GlobalAnalytics from "./GlobalAnalytics";

import "./dashboard.css";

const AdminDashboard = () => {
  const tabs = ["Organizer Approval", "Event Moderation", "Global Analytics"];
  const [active, setActive] = useState("Organizer Approval");
  const [search, setSearch] = useState("");

  return (
    <div className="organizer-dashboard">
      <DashboardHeader />

      <Tabs tabs={tabs} active={active} onChange={setActive} />

      {/* Organizer Approval */}
      {active === "Organizer Approval" && (
        <div className="content-block">
          <h2 className="section-title">
            👤 Pending organizer applications
          </h2>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search name, email, organization..."
          />
          <OrganizerTable search={search} />
        </div>
      )}

      {/* Event Moderation */}
      {active === "Event Moderation" && (
        <div className="content-block">
          <h2 className="section-title">📅 Pending events</h2>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search title, organizer, location..."
          />
          <EventsGrid search={search} />
        </div>
      )}

      {active === "Global Analytics" && (
        <div className="content-block">
          <GlobalAnalytics />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
