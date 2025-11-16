import React, { useState, useEffect } from "react";
import api from "../api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import SearchBar from "./admin/SearchBar"; 

function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events/");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch tickets claimed by this student
  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/student/tickets/");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Combined fetch for initial load
  const fetchData = async () => {
    await Promise.all([fetchEvents(), fetchTickets()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // initial fetch only
  }, []);

  const isClaimed = (eventId) => tickets.some((t) => t.event === eventId);

  // Filter events based on search term
  const filteredEvents = events.filter((e) => {
    const term = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(term) ||
      (e.location && e.location.toLowerCase().includes(term)) ||
      (e.category && e.category.toLowerCase().includes(term)) ||
      (e.organization && e.organization.toLowerCase().includes(term))
    );
  });

  const columns = [
    { header: "Event Name", accessor: "title" },
    { header: "Capacity", accessor: "capacity" },
    { header: "Ticket Type", accessor: "ticket_type" },
    { header: "Claimed", accessor: "claimed" },
  ];

  const actions = [
    {
      label: "Claim Ticket",
      type: "approve",
      onClick: async (row) => {
        if (isClaimed(row.id)) {
          alert("Ticket already claimed!");
          return;
        }
        try {
          await api.post("/api/tickets/claim/", { event: row.id });
          alert(`Ticket claimed for: ${row.title}`);
          await fetchTickets();
        } catch (err) {
          console.error(err);
          alert(err.response?.data?.detail || "Failed to claim ticket.");
        }
      },
    },
    {
      label: "View Details",
      type: "info",
      onClick: (row) => {
        setModalEvent(row);
        setModalOpen(true);
      },
    },
  ];

  if (loading) return <p>Loading events...</p>;

  const tableData = filteredEvents.map((e) => ({
    ...e,
    claimed: isClaimed(e.id) ? "Yes" : "No",
  }));

  const submitRating = async () => {
    if (!rating) return alert("Please select a rating.");
  
    try {
      await api.post(`/api/events/${modalEvent.id}/rate/`, {
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
        <p>Here are upcoming events. You can claim a ticket or view details.</p>
      </div>

      
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by title, location, category, or organization..."
      />

      {tableData.length > 0 ? (
        <Table columns={columns} data={tableData} actions={actions} />
      ) : (
        <div className="student-no-events">No events available.</div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalEvent?.title}
        actions={[
          {
            label: "Close",
            onClick: () => setModalOpen(false),
            type: "secondary",
          },
        ]}
      >
        {modalEvent && (
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
                      onChange={(e) => setRating(e.target.value)}
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
        )}
      </Modal>
    </div>
  );
}

export default StudentDashboard;
