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
    { header: "Ticket Type", accessor: "ticket_type" },
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
    {
      label: "Attendees",
      type: "export",
      onClick: async (row) => {
        try {
          const res = await api.get(`/api/tickets/export/${row.id}/`, {
            responseType: "blob",
          });
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const a = document.createElement("a");
          a.href = url;
          a.download = `${row.title}-attendees.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error(err);
          alert("Failed to export attendees.");
        }
      },
    },
  ];

  if (loading) return <p className="student-loading">Loading events...</p>;

  return (
    <div className="organizer-dashboard">
      {/* --------- HEADER --------- */}
      <div className="student-header">
        <h1>Organizer Dashboard</h1>
        <p>Manage your events below</p>
      </div>

      {/* --------- NAVIGATION BUTTONS --------- */}
      <div className="page-navigation">
          <Link to="/organizer" className="nav-button active">
              Events
          </Link>
          <Link to="/create-event" className="nav-button inactive">
            Create Event
          </Link>
          <Link to="/organizer/analytics" className="nav-button inactive">
            Analytics
          </Link>
          <Link to="/organizer/checkin" className="nav-button inactive">
            QR Check-in
          </Link>
          <Link to="/organizer/feedback" className="nav-button inactive">
            Event Feedback
          </Link>

      </div>

      {/* --------- SEARCH + FILTER --------- */}
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

      {/* --------- EVENTS TABLE --------- */}
      {filteredEvents.length > 0 ? (
        <Table columns={columns} data={filteredEvents} actions={actions} />
      ) : (
        <div className="organizer-no-events">No events match your search/filter.</div>
      )}
    </div>
  );
}

export default OrganizerDashboard;
