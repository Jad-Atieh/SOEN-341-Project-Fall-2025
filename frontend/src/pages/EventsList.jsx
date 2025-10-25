import { Link } from "react-router-dom";

const EVENTS = [
  { id: 1, title: "Hackathon 2025", date: "2025-11-10", location: "Concordia EV Building", description: "Collaborate and innovate!", capacity: 120, ticketsIssued: 96 },
  { id: 2, title: "Career Fair",    date: "2025-11-25", location: "Hall Building",           description: "Meet recruiters.",       capacity: 150, ticketsIssued: 40 },
  { id: 3, title: "Wellness Workshop", date: "2025-12-03", location: "Online",               description: "Reduce stress.",          capacity: 80,  ticketsIssued: 80 },
];

export default function EventsList() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Browse Events</h1>

      <div className="grid">
        {EVENTS.map(e => {
          const remaining = e.capacity - e.ticketsIssued;
          const pct = Math.round((e.ticketsIssued / e.capacity) * 100);
          const nearlyFull = remaining > 0 && pct >= 85;
          const soldOut = remaining <= 0;

          return (
            <article key={e.id} className="card">
              <h2 className="card-title">{e.title}</h2>
              <p><strong>Date:</strong> {e.date}</p>
              <p><strong>Location:</strong> {e.location}</p>
              <p>{e.description}</p>

              {soldOut ? (
                <button className="btn ghost" disabled>Sold Out</button>
              ) : (
                <>
                  {nearlyFull && <div className="badge warn">Only {remaining} seats left</div>}
                  <Link className="btn primary" to={`/events/${e.id}`}>Register</Link>
                </>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}