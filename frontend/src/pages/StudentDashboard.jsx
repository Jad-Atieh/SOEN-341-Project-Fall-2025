import React, { useState, useEffect } from "react";
import api from "../api";
import Modal from "../components/Modal";
import "../styles/PageStyle.css";
import { Link } from "react-router-dom"; 

function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");

  const [filter, setFilter] = useState("date");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events/");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/student/tickets/");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchEvents(), fetchTickets()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isClaimed = (eventId) => tickets.some((t) => t.event === eventId);

  const filteredEvents = events
    .filter((e) => {
      const term = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(term) ||
        (e.location && e.location.toLowerCase().includes(term)) ||
        (e.category && e.category.toLowerCase().includes(term)) ||
        (e.organization && e.organization.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (filter === "date") return new Date(a.date) - new Date(b.date);
      if (filter === "location") return a.location.localeCompare(b.location);
      if (filter === "category") return a.category.localeCompare(b.category);
      return 0;
    });

  const handleClaim = async (event) => {
    if (isClaimed(event.id)) return;
    try {
      await api.post("/api/tickets/claim/", { event: event.id });
      await fetchTickets();
      alert(`Ticket claimed for: ${event.title}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to claim ticket.");
    }
  };

  if (loading) return <p className="student-loading">Loading events...</p>;

  const submitRating = async () => {
    if (!rating) return alert("Please select a rating.");
  
    try {
      await api.post(`/api/events/${modalEvent.id}/feedback/`, {
        rating: parseInt(rating),
      });
  
      alert("Rating submitted!");
      setRating("");
      fetchEvents(); // refresh avg rating
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    }
  };
  

  return (
    <div className="student-dashboard">
      <div className="student-header">
        <h1>Welcome to your Student Dashboard!</h1>
        <p>Browse events, claim tickets, and view details.</p>
      </div>

      {/* Navigation Buttons */}
      <div className="page-navigation">
        <Link to="/student" className="nav-button active">
          All Events
        </Link>
        <Link to="/student/tickets" className="nav-button inactive">
          My Tickets
        </Link>
      </div>

      {/* Search and filter - using SAME structure as tickets page */}
      <div className="search-filter-container">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, location, category, or organization..."
          className="tickets-search-input"
        />

        <div className="filter-container">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="location">Sort by Location</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Events grid */}
      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="student-no-events">No events available.</div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-card-new">
              <div className="event-card-header">
                <h3>{event.title}</h3>
              </div>

              <div className="event-details-grid">
                <div className="detail-group">
                  <span className="detail-label">Organizer</span>
                  <span className="detail-value">{event.organization}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Date & Time</span>
                  <span className="detail-value">
                    {event.date} {event.start_time}
                  </span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{event.location}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Capacity</span>
                  <span className="detail-value">{event.capacity}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{event.category}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Ticket Status</span>
                  <span className="detail-value">
                    <strong>{isClaimed(event.id) ? "Claimed ✓" : "Available"}</strong>
                  </span>
                </div>
              </div>

              <div className="event-card-actions">
                <button
                  onClick={() => handleClaim(event)}
                  disabled={isClaimed(event.id)}
                  className="claim-btn"
                >
                  {isClaimed(event.id) ? "Ticket Claimed" : "Claim Ticket"}
                </button>
                <button
                  onClick={() => {
                    setModalEvent(event);
                    setModalOpen(true);
                  }}
                  className="details-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Modal */}
      {modalEvent && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalEvent.title}
          actions={[
            {
              label: "Close",
              onClick: () => setModalOpen(false),
              type: "secondary",
            },
          ]}
        >
          <dl className="modal-body">
            <div className="modal-row">
              <dt>Description:</dt>
              <dd>{modalEvent.description}</dd>
            </div>
            <div className="modal-row">
              <dt>Date:</dt>
              <dd>{modalEvent.date}</dd>
            </div>
            <div className="modal-row">
              <dt>Start:</dt>
              <dd>{modalEvent.start_time}</dd>
            </div>
            <div className="modal-row">
              <dt>End:</dt>
              <dd>{modalEvent.end_time}</dd>
            </div>
            <div className="modal-row">
              <dt>Location:</dt>
              <dd>{modalEvent.location}</dd>
            </div>
            <div className="modal-row">
              <dt>Capacity:</dt>
              <dd>{modalEvent.capacity}</dd>
            </div>
            <div className="modal-row">
              <dt>Ticket Type:</dt>
              <dd>{modalEvent.ticket_type}</dd>
            </div>
            <div className="modal-row">
              <dt>Category:</dt>
              <dd>{modalEvent.category}</dd>
            </div>
            <div className="modal-row">
              <dt>Organization:</dt>
              <dd>{modalEvent.organization}</dd>
            </div>
            <div className="modal-row">
                <dt>Average Rating:</dt>
                <dd>{modalEvent.avg_rating ? modalEvent.avg_rating.toFixed(1) : "No ratings yet"}</dd>
              </div>

              {/* Allow student to rate ONLY if they claimed the ticket */}
              {isClaimed(modalEvent.id) && (
                <div className="modal-row">
                  <dt>Your Rating:</dt>
                  <dd>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="">Select</option>
                      <option value="1">1 ⭐</option>
                      <option value="2">2 ⭐</option>
                      <option value="3">3 ⭐</option>
                      <option value="4">4 ⭐</option>
                      <option value="5">5 ⭐</option>
                    </select>

                    <button onClick={submitRating} className="btn primary" style={{ marginLeft: "10px" }}>
                      Submit Rating
                    </button>
                  </dd>
                </div>
              )}

          </dl>
        </Modal>
      )}
    </div>
  );
}

export default StudentDashboard;