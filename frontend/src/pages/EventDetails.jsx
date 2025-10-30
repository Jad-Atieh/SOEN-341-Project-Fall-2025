import React from "react";
import { useParams, Link } from "react-router-dom";

export default function EventDetails() {
  const { id } = useParams();
  return (
    <main className="container">
      <section className="card">
        <h1>Event Details</h1>
        <p>Event ID: {id}</p>
        <p>This is a placeholder. Connect this page to the backend later.</p>
        <Link className="btn btn-link" to="/events">← Back to Events</Link>
      </section>
    </main>
  );
}