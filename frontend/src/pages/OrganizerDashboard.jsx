import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Table from "../components/Table";
import "../styles/PageStyle.css";

function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events/");
      const mappedEvents = res.data.map((e) => ({
        ...e,
        approval_status: e.is_approved ? "Approved" : "Pending",
      }));
      setEvents(mappedEvents);
      setFilteredEvents(mappedEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;
    if (filterStatus !== "all") {
      filtered = filtered.filter((e) => e.approval_status === filterStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredEvents(filtered);
  }, [searchTerm, filterStatus, events]);

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Date", accessor: "date" },
    { header: "Start Time", accessor: "start_time" },
    { header: "End Time", accessor: "end_time" },
    { header: "Location", accessor: "location" },
    { header: "Capacity", accessor: "capacity" },
    { header: "Status", accessor: "approval_status" },
  ];

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

  const handleExportCSV = () => {
    if (!events.length) return;
    const header = columns.map((c) => c.header).join(",");
    const body = filteredEvents
      .map((e) =>
        columns.map((c) => `"${String(e[c.accessor] ?? "")}"`).join(",")
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
          Manage your events below. Export CSV, create new events, view analytics, or manage QR check-ins
        </p>
      </div>

      {/* Buttons */}
      <div className="organizer-buttons">
        <Link to="/create-event"><button>Create Event</button></Link>
        <button onClick={handleExportCSV}>Export CSV</button>
        <Link to="/organizer/analytics"><button>Analytics</button></Link>
        <Link to="/organizer/checkin"><button>QR Check-in</button></Link>
      </div>

      {/* Search + Filter */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search events..."
          className="tickets-search-input" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-container"> 
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <Table columns={columns} data={filteredEvents} actions={actions} />
      ) : (
        <div className="organizer-no-events">No events match your search/filter.</div>
      )}
    </div>
  );
}

export default OrganizerDashboard;
