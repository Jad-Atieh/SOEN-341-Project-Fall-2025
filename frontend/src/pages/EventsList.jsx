import React, { useState, useEffect } from "react";
import api from "../api";
import Modal from "../components/Modal";
import "../styles/PageStyle.css";
import { Link } from "react-router-dom";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("date");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

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

  useEffect(() => {
    fetchEvents();
  }, []);

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

  if (loading) return <p className="student-loading">Loading events...</p>;

  return (
    <div className="student-dashboard">
      {/* --------- HEADER --------- */}
      <div className="student-header">
        <h1>Welcome to Campus Events!</h1>
        <p>Explore upcoming activities, workshops, and campus events</p>
      </div>

      {/* --------- NAVIGATION BUTTONS --------- */}
      <div className="page-navigation">
        <Link to="/login" className="nav-button inactive">
          Login
        </Link>
        <Link to="/" className="nav-button active">
          Events
        </Link>
        <Link to="/signup" className="nav-button inactive">
          Signup
        </Link>
      </div>

      {/* --------- SEARCH + FILTER --------- */}
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

      {/* --------- EVENTS GRID --------- */}
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
              </div>

              <div className="event-card-actions">
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

      {/* --------- MODAL --------- */}
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
          </dl>
        </Modal>
      )}
    </div>
  );
}

export default EventsList;
