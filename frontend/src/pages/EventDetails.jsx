import { useParams, Link } from "react-router-dom";

const EVENTS = {
  1: { title: "Hackathon 2025", date: "2025-11-10", location: "Concordia EV Building", capacity: 200 },
  2: { title: "Career Fair", date: "2025-11-25", location: "Hall Building", capacity: 300 },
  3: { title: "Wellness Workshop", date: "2025-12-03", location: "Online", capacity: 100 },
};

export default function EventDetails() {
  const { id } = useParams();
  const event = EVENTS[id];

  if (!event) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Event not found</h1>
        <Link to="/events">Back to Events</Link>
      </main>
    );
  }

  const handleConfirm = () => {
    alert(`Registration confirmed for ${event.title}`);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>{event.title}</h1>
      <p><b>Date:</b> {event.date}</p>
      <p><b>Location:</b> {event.location}</p>
      <p><b>Capacity:</b> {event.capacity}</p>

      <button onClick={handleConfirm}>Confirm Registration</button>
      <Link style={{ marginLeft: 12 }} to="/events">Back to Events</Link>
    </main>
  );
}