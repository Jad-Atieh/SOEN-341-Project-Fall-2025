import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="container">
      <section className="card">
        <h1>Welcome to Campus Events 🎓</h1>
        <p>
          Discover upcoming campus events or create your own if you're an
          organizer. Stay connected and explore what’s happening at Concordia!
        </p>

        <div className="row gap" style={{ marginTop: "16px" }}>
          <Link className="btn btn-primary" to="/events">
            Browse Events
          </Link>
          <Link className="btn btn-link" to="/create">
            Create Event
          </Link>
        </div>
      </section>
    </main>
  );
}