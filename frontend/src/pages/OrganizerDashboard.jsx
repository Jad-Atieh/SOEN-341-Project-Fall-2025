import React, { useEffect, useState } from "react";
import "./OrganizerDashboard.css";
import {
  fetchOrganizerEvents,
  fetchOrganizerAnalytics,
  fetchEventQrData,
} from "./organizerApi";
import QRCodeModal from "./QRCodeModal";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [qrEvent, setQrEvent] = useState(null);
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [eventsData, analyticsData] = await Promise.all([
          fetchOrganizerEvents(),
          fetchOrganizerAnalytics(),
        ]);
        setEvents(eventsData);
        setAnalytics(analyticsData);
        setError("");
      } catch (e) {
        setError("Could not load organizer data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      event.name.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term)
    );
  });

  function handleExportCsv() {
    if (!events.length) return;

    const headers = [
      "Event ID",
      "Event Name",
      "Date",
      "Location",
      "Tickets Sold",
      "Revenue",
    ];

    const rows = events.map((e) => [
      e.id,
      e.name,
      e.date,
      e.location,
      e.ticketsSold,
      e.revenue,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => {
            if (value == null) return "";
            const str = String(value);
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "organizer_events.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async function handleOpenQr(event) {
    try {
      setIsQrOpen(true);
      setQrEvent(event);
      const qrData = await fetchEventQrData(event.id);
      setQrValue(qrData.value || "");
    } catch (e) {
      setQrValue("");
    }
  }

  function handleCloseQr() {
    setIsQrOpen(false);
    setQrEvent(null);
    setQrValue("");
  }

  return (
    <div className="organizer-dashboard">
      <header className="organizer-header">
        <div>
          <h1 className="organizer-title">Organizer Dashboard</h1>
          <p className="organizer-subtitle">
            Manage your events, tickets and analytics in one place.
          </p>
        </div>
        <div className="organizer-actions">
          <button className="primary-button" onClick={handleExportCsv}>
            Export tickets CSV
          </button>
        </div>
      </header>

      {analytics && (
        <section className="analytics-cards">
          <div className="analytics-card">
            <span className="analytics-label">Total events</span>
            <span className="analytics-value">{analytics.totalEvents}</span>
          </div>
          <div className="analytics-card">
            <span className="analytics-label">Tickets sold</span>
            <span className="analytics-value">{analytics.totalTickets}</span>
          </div>
          <div className="analytics-card">
            <span className="analytics-label">Revenue</span>
            <span className="analytics-value">
              ${analytics.totalRevenue.toLocaleString()}
            </span>
          </div>
        </section>
      )}

      <section className="events-section">
        <div className="section-header">
          <h2>My events</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="helper-text">Loading events...</p>}
        {error && !loading && <p className="error-text">{error}</p>}
        {!loading && !events.length && !error && (
          <p className="helper-text">You do not have any events yet.</p>
        )}

        {!!filteredEvents.length && (
          <div className="table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Tickets sold</th>
                  <th>Revenue</th>
                  <th>QR code</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{event.date}</td>
                    <td>{event.location}</td>
                    <td>{event.ticketsSold}</td>
                    <td>${event.revenue.toLocaleString()}</td>
                    <td>
                      <button
                        className="secondary-button"
                        onClick={() => handleOpenQr(event)}
                      >
                        View QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isQrOpen && (
        <QRCodeModal event={qrEvent} value={qrValue} onClose={handleCloseQr} />
      )}
    </div>
  );
}