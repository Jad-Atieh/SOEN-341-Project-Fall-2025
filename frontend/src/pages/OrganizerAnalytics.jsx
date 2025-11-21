import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Modal from "../components/Modal";
import "../styles/PageStyle.css";

function OrganizerAnalytics() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("date");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [overallStats, setOverallStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    checkedInTickets: 0,
    totalCapacity: 0
  });

  useEffect(() => {
    async function fetchEventAnalytics() {
      try {
        const res = await api.get("/api/events/");
        const eventsData = res.data;

        const eventsWithAnalytics = await Promise.all(
          eventsData.map(async (event) => {
            try {
              const analyticsRes = await api.get(`/api/tickets/data/${event.id}/`);
              return { ...event, analytics: analyticsRes.data };
            } catch (err) {
              console.error("Error fetching analytics for event:", event.id, err);
              return { ...event, analytics: { tickets: [], summary: { total_tickets: 0, used_tickets: 0, capacity_left: 0 } } };
            }
          })
        );

        setEvents(eventsWithAnalytics);
        setFilteredEvents(eventsWithAnalytics);
        
        // Calculate overall stats
        const stats = eventsWithAnalytics.reduce((acc, event) => {
          const tickets = event.analytics?.tickets || [];
          return {
            totalEvents: acc.totalEvents + 1,
            totalTickets: acc.totalTickets + tickets.length,
            checkedInTickets: acc.checkedInTickets + tickets.filter(t => t.status === "used").length,
            totalCapacity: acc.totalCapacity + (event.capacity || 0)
          };
        }, { totalEvents: 0, totalTickets: 0, checkedInTickets: 0, totalCapacity: 0 });
        
        setOverallStats(stats);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEventAnalytics();
  }, []);

  useEffect(() => {
    let filtered = events.filter((event) =>
      event.title.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "date") {
      filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filter === "title") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filter === "used") {
      filtered = filtered.sort(
        (a, b) => (b.analytics?.tickets.filter(t => t.status === "used").length || 0) -
                  (a.analytics?.tickets.filter(t => t.status === "used").length || 0)
      );
    } else if (filter === "capacity") {
      filtered = filtered.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
    }

    setFilteredEvents(filtered);
  }, [search, filter, events]);

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalOpen(false);
  };

  if (loading) return <p className="student-loading">Loading analytics...</p>;

  return (
    <div className="organizer-dashboard">
      <div className="organizer-header">
        <h1>Event Analytics Dashboard</h1>
        <p>Comprehensive insights into your event performance and ticket statistics</p>
      </div>

      <div className="page-navigation">
        <Link to="/organizer" className="nav-button inactive">Events</Link>
        <Link to="/create-event" className="nav-button inactive">Create Event</Link>
        <Link to="/organizer/analytics" className="nav-button active">Analytics</Link>
        <Link to="/organizer/checkin" className="nav-button inactive">QR Check-in</Link>
      </div>

      {/* Overall Stats Cards */}
      <div className="analytics-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{overallStats.totalEvents}</h3>
            <p>Total Events</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <h3>{overallStats.totalTickets}</h3>
            <p>Total Tickets</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{overallStats.checkedInTickets}</h3>
            <p>Checked In</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{overallStats.totalCapacity}</h3>
            <p>Total Capacity</p>
          </div>
        </div>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search events by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="tickets-search-input"
        />
        <div className="filter-container">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="used">Sort by Check-ins</option>
            <option value="capacity">Sort by Capacity</option>
          </select>
        </div>
      </div>

      <div className="analytics-container">
        {filteredEvents.length === 0 ? (
          <div className="organizer-no-events">
            <p>No events match your search criteria.</p>
            <p>Try adjusting your search or filter to see more results.</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const tickets = event.analytics?.tickets || [];
            const totalTickets = tickets.length;
            const usedTickets = tickets.filter(t => t.status === "used").length;
            const claimedTickets = tickets.filter(t => t.status === "active").length;
            const availableTickets = Math.max((event.capacity || 0) - totalTickets, 0);
            const attendanceRate = totalTickets > 0 ? ((usedTickets / totalTickets) * 100).toFixed(1) : 0;

            return (
              <div key={event.id} className="analytics-card">
                <div className="analytics-card-header">
                  <h3>{event.title}</h3>
                  <span className={`event-status ${usedTickets > 0 ? 'active' : 'upcoming'}`}>
                    {usedTickets > 0 ? 'Active' : 'Upcoming'}
                  </span>
                </div>

                <div className="analytics-content">
                  <div className="event-details-section">
                    <div className="detail-row">
                      <span className="detail-label">Date & Time</span>
                      <span className="detail-value">{event.date} • {event.start_time} - {event.end_time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Capacity</span>
                      <span className="detail-value">{event.capacity} seats</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Attendance Rate</span>
                      <span className="detail-value highlight">{attendanceRate}%</span>
                    </div>
                    <div className="stats-grid">
                      <div className="mini-stat">
                        <span className="mini-stat-value">{totalTickets}</span>
                        <span className="mini-stat-label">Total Tickets</span>
                      </div>
                      <div className="mini-stat">
                        <span className="mini-stat-value">{usedTickets}</span>
                        <span className="mini-stat-label">Checked In</span>
                      </div>
                      <div className="mini-stat">
                        <span className="mini-stat-value">{claimedTickets}</span>
                        <span className="mini-stat-label">Claimed</span>
                      </div>
                      <div className="mini-stat">
                        <span className="mini-stat-value">{availableTickets}</span>
                        <span className="mini-stat-label">Available</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analytics-actions">
                  <button className="details-btn active" onClick={() => openModal(event)}>
                    📋 View Attendee Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={selectedEvent ? `${selectedEvent.title} - Attendee Details` : ""}
        size="large"
      >
        {selectedEvent && (
          <div className="attendee-modal-content">
            <div className="attendee-section">
              <h4>✅ Checked-in Attendees ({selectedEvent.analytics.tickets.filter(t => t.status === "used").length})</h4>
              <div className="attendee-list">
                {selectedEvent.analytics.tickets
                  .filter(t => t.status === "used")
                  .map((t, index) => (
                    <div key={`${t.student_email}-${t.event_title}-used`} className="attendee-item">
                      <span className="attendee-number">{index + 1}.</span>
                      <div className="attendee-info">
                        <span className="attendee-name">{t.student_name}</span>
                        <span className="attendee-email">{t.student_email}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="attendee-section">
              <h4>🎫 Claimed Tickets ({selectedEvent.analytics.tickets.filter(t => t.status === "active").length})</h4>
              <div className="attendee-list">
                {selectedEvent.analytics.tickets
                  .filter(t => t.status === "active")
                  .map((t, index) => (
                    <div key={`${t.student_email}-${t.event_title}`} className="attendee-item">
                      <span className="attendee-number">{index + 1}.</span>
                      <div className="attendee-info">
                        <span className="attendee-name">{t.student_name}</span>
                        <span className="attendee-email">{t.student_email}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrganizerAnalytics;