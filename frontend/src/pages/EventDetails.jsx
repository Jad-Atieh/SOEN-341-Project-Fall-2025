// frontend/src/pages/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

function niceMoney(v) {
  return Number(v) === 0 ? "Free" : `$${Number(v).toFixed(2)}`;
}

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get(`/events/${id}/`);
        if (alive) setEvent(data);
      } catch (e) {
        setErr("Failed to load event.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (err) return <div style={{ padding: 24, color: "crimson" }}>{err}</div>;
  if (!event) return <div style={{ padding: 24 }}>Not found.</div>;

  const seatsLeft = Math.max(0, event.ticket_capacity - (event.tickets_sold ?? 0));
  const soldOut = seatsLeft === 0;
  const occupancy = event.ticket_capacity ? (1 - seatsLeft / event.ticket_capacity) * 100 : 0;
  const nearlyFull = !soldOut && occupancy >= 85;

  return (
    <div style={{ maxWidth: 920, margin: "32px auto", padding: "0 16px" }}>
      <Link to="/events">← Back to events</Link>
      <h1 style={{ marginTop: 12 }}>{event.title}</h1>
      <p>{event.description}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div><strong>Date</strong><div>{event.date}</div></div>
        <div><strong>Time</strong><div>{event.time}</div></div>
        <div><strong>Location</strong><div>{event.location}</div></div>
        <div><strong>Price</strong><div>{niceMoney(event.price)}</div></div>
        <div><strong>Capacity</strong><div>{event.ticket_capacity}</div></div>
        <div><strong>Seats left</strong><div>{seatsLeft}</div></div>
      </div>

      {soldOut && <div style={{ marginTop: 16, color: "crimson" }}>Sold out</div>}
      {nearlyFull && !soldOut && (
        <div style={{ marginTop: 16, color: "#d97706" }}>
          Hurry — only {seatsLeft} seats left!
        </div>
      )}
    </div>
  );
}