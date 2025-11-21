import React, { useState, useEffect } from "react";
import { adminApi } from "./adminApi";

import AnalyticsPieChart from "./AnalyticsPieChart";
import TopEventsTable from "./TopEventsTable";
import OrganizerPerformanceTable from "./OrganizerPerformanceTable";

// Import Chart.js bar chart dependencies
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

  // Bar chart data for tickets
  const ticketsBarData = {
    labels: ["Total", "Active", "Used", "Cancelled"],
    datasets: [
      {
        label: "Tickets",
        data: [
          data.tickets.total,
          data.tickets.active,
          data.tickets.used,
          data.tickets.cancelled,
        ],
        backgroundColor: "#673AB7",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

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
        <AnalyticsPieChart title="Users Breakdown" data={usersData} />
        <AnalyticsPieChart title="Events Breakdown" data={eventsData} />

        {/* NEW TICKETS BAR CHART */}
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            background: "white",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Tickets Overview
          </h3>
          <Bar data={ticketsBarData} options={barOptions} />
        </div>
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
