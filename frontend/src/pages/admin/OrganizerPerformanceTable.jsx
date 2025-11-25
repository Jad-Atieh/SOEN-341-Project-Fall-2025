import React, { useState } from "react";
import AdminTable from "./AdminTable";
import SearchBarDashboard from "./SearchBarDashboard";

export default function OrganizerPerformanceTable({ data }) {
  const [search, setSearch] = useState("");

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Total Events", accessor: "total_events" },
    { header: "Approved Events", accessor: "approved_event_count" },
    { header: "Total Tickets Sold", accessor: "total_tickets" },
  ];

  const filtered = data.filter(
    (o) =>
      (o.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Organizer Performance</h2>

      {/* <SearchBarDashboard
        value={search}
      onChange={setSearch}p
        placeholder="Search organizers..."
      /> */}

      {filtered.length > 0 ? (
        <AdminTable columns={columns} data={filtered} />
      ) : (
        <p>No organizer performance data to display.</p>
      )}
    </div>
  );
}
