import { useState } from "react";

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    { id: 1, title: "Tech Talk 2025", date: "Oct 20, 2025", category: "Technology", description: "Join experts to discuss AI innovation." },
    { id: 2, title: "Halloween Party 🎃", date: "Oct 31, 2025", category: "Social", description: "Costume party with music and snacks." },
    { id: 3, title: "Wellness Workshop", date: "Nov 5, 2025", category: "Health", description: "Tips for managing stress during finals." },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <header style={{ backgroundColor: "#002b5c", color: "white", padding: "20px" }}>
        <h1>Campus Events</h1>
      </header>

      {!selectedEvent && (
        <main style={{ padding: "20px" }}>
          <h2>Upcoming Events</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            {events.map((event) => (
              <div key={event.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px" }}>
                <h3>{event.title}</h3>
                <p>{event.date}</p>
                <p><b>{event.category}</b></p>
                <button onClick={() => setSelectedEvent(event)}>View Details</button>
              </div>
            ))}
          </div>
        </main>
      )}

      {selectedEvent && (
        <div style={{ padding: "20px" }}>
          <button onClick={() => setSelectedEvent(null)}>← Back to events</button>
          <h2>{selectedEvent.title}</h2>
          <p><b>Date:</b> {selectedEvent.date}</p>
          <p><b>Category:</b> {selectedEvent.category}</p>
          <p>{selectedEvent.description}</p>
          <button>Get Ticket</button>
        </div>
      )}
    </div>
  );
}

export default App;
