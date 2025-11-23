import React, { useState } from "react";
import AdminTable from "./AdminTable";
import SearchBarDashboard from "./SearchBarDashboard";

export default function TopEventsTable({ data }) {
  const [search, setSearch] = useState("");

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    { header: "Category", accessor: "category" },
    { header: "Organizer", accessor: "organization" },
    { header: "Tickets", accessor: "ticket_count" },
  ];

  const filtered = data.filter((e) =>
    (e.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Top Events</h2>

      {/* <SearchBarDashboard
        value={search}
        onChange={setSearch}
        placeholder="Search events..."
      /> */}

      {filtered.length > 0 ? (
        <AdminTable columns={columns} data={filtered} />
      ) : (
        <p>No event data to show.</p>
      )}
    </div>
  );
}
