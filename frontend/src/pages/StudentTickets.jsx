import React, { useEffect, useState } from "react";
import api from "../api";
import "../styles/PageStyle.css";
import { Link } from "react-router-dom"; 

function StudentTickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("date");

  useEffect(() => {
    async function fetchTicketsWithEvents() {
      try {
        const ticketRes = await api.get("/api/student/tickets/");
        const ticketData = ticketRes.data;

        const ticketsWithEvents = await Promise.all(
          ticketData.map(async (ticket) => {
            const eventRes = await api.get(`/api/events/${ticket.event}/`);
            return { ...ticket, event: eventRes.data };
          })
        );

        setTickets(ticketsWithEvents);
        setFilteredTickets(ticketsWithEvents);
      } catch (err) {
        console.error("Error fetching tickets or events:", err);
      }
    }

    fetchTicketsWithEvents();
  }, []);

  useEffect(() => {
    let filtered = tickets.filter(ticket =>
      ticket.event?.title.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "date") {
      filtered = filtered.sort((a, b) => new Date(a.event?.date) - new Date(b.event?.date));
    } else if (filter === "status") {
      filtered = filtered.sort((a, b) => a.status.localeCompare(b.status));
    } else if (filter === "used") {
      filtered = filtered.sort((a, b) => {
        const aUsed = a.used_at ? 1 : 0;
        const bUsed = b.used_at ? 1 : 0;
        return aUsed - bUsed;
      });
    }

    setFilteredTickets(filtered);
  }, [search, filter, tickets]);

  return (
    <div className="student-tickets-page">
      <div className="student-header">
        <h1>Your Tickets</h1>
        <p>
          Here you can view all your claimed tickets.
        </p>
      </div>

        {/* Navigation Buttons */}
      <div className="page-navigation">
        <Link to="/student" className="nav-button inactive">
          All Events
        </Link>
        <Link to="/student/tickets" className="nav-button active">
          My Tickets
        </Link>
        <Link to="/my-feedback" className="nav-button inactive">
          My Feedback
        </Link>
      </div>

      {/* Using the exact same search-filter container from dashboard */}
      <div className="search-filter-container">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tickets by event title..."
          className="tickets-search-input"
        />

        <div className="filter-container">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
            <option value="used">Sort by Used</option>
          </select>
        </div>
      </div>

      <div className="tickets-container">
        {filteredTickets.length === 0 ? (
          <p className="student-no-events">No tickets available.</p>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
  <div className="ticket-info">
    <div className="ticket-card-header">
      <h3>{ticket.event?.title || "Untitled Event"}</h3>
    </div>

    <div className="ticket-details-grid">
      <div className="ticket-detail-group">
        <span className="ticket-detail-label">Date</span>
        <span className="ticket-detail-value">{ticket.event?.date || "No date"}</span>
      </div>
      <div className="ticket-detail-group">
        <span className="ticket-detail-label">Time</span>
        <span className="ticket-detail-value">{ticket.event?.start_time || "No time"}</span>
      </div>
      <div className="ticket-detail-group">
        <span className="ticket-detail-label">Location</span>
        <span className="ticket-detail-value">{ticket.event?.location || "N/A"}</span>
      </div>
      <div className="ticket-detail-group">
        <span className="ticket-detail-label">Status</span>
        <span className="ticket-detail-value">{ticket.status}</span>
      </div>
      <div className="ticket-detail-group">
        <span className="ticket-detail-label">Claimed</span>
        <span className="ticket-detail-value">{ticket.claimed_at || "None"}</span>
      </div>
      <div className="ticket-detail-group">
        <span className="ticket-detail-label">Used</span>
        <span className="ticket-detail-value">{ticket.used_at || "None"}</span>
      </div>
    </div>
  </div>

  <div className="ticket-qr">
    <img 
      src={ticket.qr_code} 
      alt="QR Code" 
    />
  </div>
</div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentTickets;