import React, { useEffect, useState } from "react";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
          const token = localStorage.getItem("access");
      
          const response = await fetch("http://127.0.0.1:8000/api/events/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch events");
          }
      
          const data = await response.json();
          setEvents(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }; 

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.name}</strong> — {event.category} — {event.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventsList;
