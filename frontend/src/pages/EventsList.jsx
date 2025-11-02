import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const EVENTS = [
  {
    id: 1,
    title: "Hackathon 2025",
    date: "2025-11-10",
    category: "Technology",
    location: "Concordia EV Building",
    description: "Collaborate and innovate in our annual student hackathon!",
    capacity: 200,
    ticketsIssued: 170,
  },
  {
    id: 2,
    title: "Career Fair",
    date: "2025-11-25",
    category: "Career",
    location: "Hall Building",
    description: "Meet top recruiters and explore internship opportunities.",
    capacity: 150,
    ticketsIssued: 80,
  },
  {
    id: 3,
    title: "Wellness Workshop",
    date: "2025-12-03",
    category: "Wellness",
    location: "Online",
    description: "Learn techniques to reduce stress and improve balance.",
    capacity: 120,
    ticketsIssued: 120,
  },
];

const CATEGORIES = ["All", "Technology", "Career", "Wellness"];

function StatusTag({ e }) {
  const soldOut = e.ticketsIssued >= e.capacity;
  if (soldOut) return <span className="tag soldout">Sold Out</span>;

  const pct = Math.round((e.ticketsIssued / e.capacity) * 100);
  if (pct >= 85) {
    const remaining = e.capacity - e.ticketsIssued;
    return <span className="tag warning">Only {remaining} seats left</span>;
  }
  return <span className="tag ok">Available</span>;
}

export default function EventsList() {
  const [activeCat, setActiveCat] = useState("All");

  const filtered = useMemo(() => {
    if (activeCat === "All") return EVENTS;
    return EVENTS.filter((e) => e.category === activeCat);
  }, [activeCat]);

  return (
    <main className="container">
      <header className="page-header">
        <h1>Upcoming Events</h1>
      </header>

      <div className="row gap" style={{ marginBottom: 16 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`btn ${c === activeCat ? "btn-primary" : "btn-link"}`}
            onClick={() => setActiveCat(c)}
            type="button"
          >
            {c}
          </button>
        ))}
      </div>

      <section className="grid">
        {filtered.map((e) => (
          <article className="card" key={e.id}>
            <div className="row between" style={{ marginBottom: 6 }}>
              <h3 style={{ margin: 0 }}>{e.title}</h3>
              <span className="tag">{e.category}</span>
            </div>
            <p className="muted">Date: {e.date}</p>
            <p className="muted">Location: {e.location}</p>
            <p>{e.description}</p>

            <div className="row between" style={{ marginTop: 10 }}>
              <StatusTag e={e} />
              <Link className="btn btn-link" to={`/events/${e.id}`}>
                Details
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}