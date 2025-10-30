import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="container">
      <section className="card">
        <h1>Welcome to Campus Events</h1>
        <p>Discover upcoming events, or create one if you’re an organizer.</p>
        <div className="row gap">
          <Link className="btn btn-primary" to="/events">Browse Events</Link>
          <Link className="btn btn-link" to="/create">Create Event</Link>
        </div>
      </section>
    </main>
  );
}