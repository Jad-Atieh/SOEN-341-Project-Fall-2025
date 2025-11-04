import React, { useEffect, useState } from "react";
import { adminApi } from "./adminApi"

export default function EventModeration() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    adminApi.listPendingEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const act = async (id, kind) => {
    if (kind === "approve") await adminApi.approveEvent(id);
    else await adminApi.rejectEvent(id);
    setEvents((prev) => prev.filter((x) => x.id !== id));
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div>
      <h2>Pending Events</h2>
      {events.map((e) => (
        <div key={e.id}>
          <h3>{e.title}</h3>
          <p>{e.organizer}</p>
          <button onClick={() => act(e.id, "approve")}>Approve</button>
          <button onClick={() => act(e.id, "reject")}>Reject</button>
        </div>
      ))}
      {events.length === 0 && <p>No pending events.</p>}
    </div>
  );
}
