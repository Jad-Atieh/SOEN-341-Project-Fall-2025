import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { adminApi } from "./adminApi";

const EventsGrid = ({ search }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listPendingEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    }).catch(error => {
      console.error("Failed to fetch pending events:", error);
      setLoading(false);
    });
  }, []);

  const handleAction = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const filtered = events.filter(e =>
    (e.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (e.organizer?.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (e.location?.toLowerCase() || '').includes(search.toLowerCase())
  );

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="grid">
      {filtered.length > 0 ? filtered.map((e) => (
        <EventCard key={e.id} event={e} onAction={handleAction} />
      )) : <p>No pending events to moderate.</p>}
    </div>
  );
};

export default EventsGrid;
