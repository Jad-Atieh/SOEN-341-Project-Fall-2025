import React, { useState, useEffect } from "react";
import api from "../api";
import Table from "../components/Table";

function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events/"); 
        setEvents(res.data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Date", accessor: "date" },
    { header: "Start Time", accessor: "start_time" },
    { header: "End Time", accessor: "end_time" },
    { header: "Location", accessor: "location" },
    { header: "Capacity", accessor: "capacity" },
    { header: "Ticket Type", accessor: "ticket_type" },
  ];

  const actions = [
    {
      label: "Claim Ticket",
      type: "approve",
      onClick: async (row) => {
        try {
          await api.post("/api/tickets/claim/", { event: row.id });
          alert(`Ticket claimed for event: ${row.title}`);
        } catch (err) {
          console.error(err.response?.data);
          alert(err.response?.data?.detail || "Failed to claim ticket.");
        }
      }
    },
    {
      label: "View Details",
      type: "info",
      onClick: (row) => {
        alert(`Event Details:\n${row.description}`);
      }
    }
  ];

  if (loading) return <p>Loading events...</p>;

return (
    <div className="student-dashboard">
      <div className="student-header">
        <h1>Welcome to your Student Dashboard!</h1>
        <p>Here are upcoming events you can attend. Click "Claim Ticket" to reserve your spot.</p>
      </div>
  
      {events.length > 0 ? (
        <Table columns={columns} data={events} actions={actions} />
      ) : (
        <p className="student-no-events">No upcoming events available.</p>
      )}
    </div>
  );
}

export default StudentDashboard;
