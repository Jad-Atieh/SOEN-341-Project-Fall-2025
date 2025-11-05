import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./events.css";

function readEvents() {
  try {
    const raw = localStorage.getItem("draftEvents") || "[]";
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function pct(a, b) {
  if (!b || b <= 0) return 0;
  return Math.min(100, Math.round((a / b) * 100));
}

export default function EventsList() {
  const all = useMemo(() => readEvents(), []);
  const categories = useMemo(() => {
    const set = new Set(all.map(e => e.form?.category || e.category || "General"));
    return ["All", ...Array.from(set)];
  }, [all]);
  const [active, setActive] = useState("All");

  const events = useMemo(() => {
    const list = all.map(e => {
      const title = e.form?.title || e.title || "Untitled";
      const date = e.form?.date || e.date || "";
      const time = e.form?.time || e.time || "";
      const location = e.form?.location || e.location || "";
      const category = e.form?.category || e.category || "General";
      const description = e.form?.description || e.description || "";
      const capacity = Number(e.capacity || 0);
      const taken = Number(e.taken || 0);
      const remain = Math.max(0, capacity - taken);
      const percentage = pct(taken, capacity);
      const soldOut = capacity > 0 && taken >= capacity;
      const nearly = !soldOut && capacity > 0 && percentage >= 85;
      return { id: e.id || title, title, date, time, location, category, description, capacity, taken, remain, percentage, soldOut, nearly };
    });
    return active === "All" ? list : list.filter(e => e.category === active);
  }, [all, active]);

  return (
    <div className="events-wrap">
      <header className="events-header">
        <h1>Browse Events</h1>
        <div className="events-cats">
          {categories.map(c => (
            <button
              key={c}
              className={c === active ? "cat-btn active" : "cat-btn"}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="events-grid">
        {events.length === 0 && <div className="empty">No events found.</div>}
        {events.map(e => (
          <div key={e.id} className="event-card">
            <div className="event-top">
              <h3 className="event-title">{e.title}</h3>
              <div className="badges">
                {e.soldOut && <span className="badge">Sold out</span>}
                {e.nearly && <span className="badge">{e.remain} seats left</span>}
              </div>
            </div>

            <div className="event-meta">
              <div><strong>Date:</strong> {e.date} {e.time}</div>
              <div><strong>Location:</strong> {e.location}</div>
              <div><strong>Category:</strong> {e.category}</div>
            </div>

            {e.description && <p className="event-desc">{e.description}</p>}

            {e.capacity > 0 && (
              <div className="meter">
                <div className="meter-label">Sold {e.taken}/{e.capacity} ({e.percentage}%)</div>
                <div className="meter-bar">
                  <div className="meter-fill" style={{ width: `${e.percentage}%` }} />
                </div>
              </div>
            )}

            <div className="card-actions">
              <Link to={`/event/${encodeURIComponent(e.id)}`}><button>Details</button></Link>
              <Link to={`/create-event?id=${encodeURIComponent(e.id)}`}><button>Edit</button></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}