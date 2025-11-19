import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Table from "../components/Table";
import "../styles/PageStyle.css";


function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch events from backend and map status
  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events/");
      const mappedEvents = res.data.map((e) => ({
        ...e,
        approval_status: e.is_approved ? "Approved" : "Pending",
      }));
      setEvents(mappedEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Table columns
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Date", accessor: "date" },
    { header: "Start Time", accessor: "start_time" },
    { header: "End Time", accessor: "end_time" },
    { header: "Location", accessor: "location" },
    { header: "Capacity", accessor: "capacity" },
    { header: "Status", accessor: "approval_status" }, // shows Approved or Pending
  ];

  // Table actions
  const actions = [
    {
      label: "Edit",
      type: "edit",
      onClick: (row) => navigate(`/edit-event/${row.id}`),
    },
    {
      label: "Delete",
      type: "delete",
      onClick: async (row) => {
        if (window.confirm(`Are you sure you want to delete "${row.title}"?`)) {
          try {
            await api.delete(`/api/events/${row.id}/`);
            fetchEvents(); 
          } catch (err) {
            console.error(err);
            alert("Failed to delete event.");
          }
        }
      },
    },
  ];

  // CSV export
  const handleExportCSV = () => {
    if (!events.length) return;
    const header = columns.map((c) => c.header).join(",");
    const body = events
      .map((e) =>
        columns
          .map((c) => `"${String(e[c.accessor] ?? "")}"`)
          .join(",")
      )
      .join("\n");
    const csv = header + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="organizer-dashboard">
      <div className="organizer-header">
        <h1>Organizer Dashboard</h1>
        <p>
          Manage your events below. You can export the table as CSV, create new
          events, view analytics, or manage QR check-ins.
        </p>
      </div>

      {events.length > 0 ? (
        <Table columns={columns} data={events} actions={actions} />
      ) : (
        <div className="organizer-no-events">No events available.</div>
      )}

      <div className="organizer-buttons">
        <Link to="/create-event">
          <button>Create Event</button>
        </Link>
        <button onClick={handleExportCSV}>Export CSV</button>
        <Link to="/organizer/analytics">
          <button>Analytics</button>
        </Link>
        <Link to="/organizer/checkin">
          <button>QR Check-in</button>
        </Link>
      </div>
    </div>
  );
}

export default OrganizerDashboard;
