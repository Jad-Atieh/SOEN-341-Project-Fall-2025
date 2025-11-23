import React, { useState, useEffect, useMemo } from "react";
import { feedbackService } from "../api";
import "../styles/PageStyle.css";
import { Link } from "react-router-dom";

function OrganizerFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const resp = await feedbackService.getOrganizerFeedback();
      setFeedback(resp.data);
    } catch (err) {
      console.error("Error fetching organizer feedback:", err);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const events = useMemo(() => {
    const map = new Map();
    feedback.forEach((f) => {
      if (f.event && !map.has(f.event)) {
        map.set(
          f.event,
          f.event_title || f.event?.title || `Event ${f.event}`
        );
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [feedback]);

  const visible = useMemo(() => {
    let arr = [...feedback];

    if (eventFilter !== "all") {
      arr = arr.filter((f) => String(f.event) === String(eventFilter));
    }

    arr.sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sortOrder === "oldest" ? ta - tb : tb - ta;
    });

    return arr;
  }, [feedback, sortOrder, eventFilter]);

  return (
    <div className="organizer-dashboard">
      <div className="organizer-header">
        <h1>Event Feedback</h1>
        <p>View all ratings and reviews left by attendees</p>
      </div>

      <div className="organizer-buttons">
        <Link to="/organizer"><button>Dashboard</button></Link>
        <Link to="/create-event"><button>Create Event</button></Link>
        <Link to="/organizer/analytics"><button>Analytics</button></Link>
        <Link to="/organizer/checkin"><button>QR Check-in</button></Link>
        <Link to="/organizer/feedback"><button>Event Feedback</button></Link>
      </div>

     
      <div className="organizer-feedback-filters">

        {/* Sort */}
        <div className="filter-group">
            <label className="filter-label">Sort</label>
            <select
            className="status-filter"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            </select>
        </div>

        {/* Event Filter */}
        <div className="filter-group">
            <label className="filter-label">Event</label>
            <select
            className="status-filter"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            >
            <option value="all">All events</option>
            {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                {ev.title}
                </option>
            ))}
            </select>
        </div>
</div>

      {/* FEEDBACK CARDS */}
      <div className="tickets-container">
        {loading ? (
          <p className="student-loading">Loading feedback...</p>
        ) : visible.length === 0 ? (
          <p className="student-no-events">No feedback available yet.</p>
        ) : (
          visible.map((item) => (
            <div key={item.id} className="ticket-card feedback-card-organizer">

              <div className="feedback-header">
                <h3>{item.event_title || item.event}</h3>
                <div className="feedback-rating-block">
                  <div className="rating-number">{item.rating} ⭐</div>
                  <div className="rating-date">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="feedback-body">
                <div className="feedback-comment">
                  {item.comment ? item.comment : <em>No comment</em>}
                </div>

                <div className="feedback-user">
                  <div className="feedback-username">
                    {item.user_name || "Anonymous"}
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrganizerFeedback;
