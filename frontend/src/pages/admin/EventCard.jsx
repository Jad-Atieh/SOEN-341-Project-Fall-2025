import React from "react";
import { adminApi } from "./adminApi";

const EventCard = ({ event, onAction }) => {
  const formatStartTime = (date, time) => {
    return new Date(`${date}T${time}`).toLocaleString([], {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const approveEvent = async () => {
    await adminApi.approveEvent(event.id);
    onAction(event.id);
  };

  const rejectEvent = async () => {
    await adminApi.rejectEvent(event.id);
    onAction(event.id);
  };

  return (
    <div className="event-card">
      <h3 className="event-title">{event.title}</h3>

      <div className="event-info">
        <span>Organizer</span>
        <p>{event.organizer || 'N/A'}</p>
        
        <span>Starts</span>
        <p>{formatStartTime(event.date, event.start_time)}</p>

        <span>Location</span>
        <p>{event.location}</p>

        <span>Tickets Requested</span>
        <p>{event.capacity}</p>
      </div>

      <div className="card-actions">
        <button className="approve" onClick={approveEvent}>✔ Approve</button>
        <button className="reject" onClick={rejectEvent}>✖ Reject</button>
      </div>
    </div>
  );
};

export default EventCard;
