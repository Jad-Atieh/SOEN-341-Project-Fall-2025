import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api("/events/");
        if (alive) setEvents(Array.isArray(data) ? data : (data.results || []));
      } catch (e) {
        setErr(e?.message || "Failed to load events");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <main className="page-container"><p>Loading…</p></main>;
  if (err) {
    // ne pas crasher l'app : on affiche l’erreur ET une UI vide
    return (
      <main className="page-container">
        <h1>Events</h1>
        <p style={{ color: "crimson" }}>{err}</p>
        {events.length === 0 && <p>No events yet.</p>}
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1>Events</h1>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
          {events.map((e) => (
            <li key={e.id}>
              <Link to={`/events/${e.id}`} style={{ fontWeight: 600 }}>
                {e.title || e.name || `Event #${e.id}`}
              </Link>
              {e.start_time && <div>{new Date(e.start_time).toLocaleString()}</div>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}