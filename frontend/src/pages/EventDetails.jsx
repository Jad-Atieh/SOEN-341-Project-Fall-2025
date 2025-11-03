import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api(`/events/${id}/`);
        if (alive) setEvent(data);
      } catch (e) {
        setErr(e?.message || "Failed to load event");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) return <main className="page-container"><p>Loading…</p></main>;
  if (err) return (
    <main className="page-container">
      <p style={{ color: "crimson" }}>{err}</p>
      <Link to="/events">Back to list</Link>
    </main>
  );

  if (!event) return (
    <main className="page-container">
      <p>Event not found.</p>
      <Link to="/events">Back to list</Link>
    </main>
  );

  return (
    <main className="page-container">
      <h1>{event.title || event.name || `Event #${event.id}`}</h1>
      {event.start_time && <p><b>When:</b> {new Date(event.start_time).toLocaleString()}</p>}
      {event.description && <p>{event.description}</p>}
      <p><Link to="/events">Back to list</Link></p>
    </main>
  );
}