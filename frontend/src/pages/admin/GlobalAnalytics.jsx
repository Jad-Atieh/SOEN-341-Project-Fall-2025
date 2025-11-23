import React, { useState, useEffect } from "react";
import { adminApi } from "./adminApi";

import AnalyticsPieChart from "./AnalyticsPieChart";
import TopEventsTable from "./TopEventsTable";
import OrganizerPerformanceTable from "./OrganizerPerformanceTable";
import TicketsBarChart from "./TicketsBarChart";

export default function GlobalAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getGlobalAnalytics()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p>{error}</p>;

  // Pie chart data
  const usersData = [
    { name: "Active", value: data.users.active },
    { name: "Pending", value: data.users.pending },
    { name: "Suspended", value: data.users.suspended },
  ];

  const eventsData = [
    { name: "Approved", value: data.events.approved },
    { name: "Pending", value: data.events.pending },
    { name: "Rejected", value: data.events.rejected },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <AnalyticsPieChart
          title="Users Overview"
          data={usersData}
          roles={data.users.by_role}
        />        
        <AnalyticsPieChart title="Events Overview" data={eventsData} />
        <TicketsBarChart data={data.tickets} />

      </div>

      {/* Top Events Table */}
      {data?.events?.top_events && (
        <TopEventsTable data={data.events.top_events} />
      )}

      {/* Organizer Performance Table */}
      {data?.organizer_performance && (
        <OrganizerPerformanceTable data={data.organizer_performance} />
      )}
    </div>
  );
}
