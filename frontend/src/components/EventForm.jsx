/**
 * CreateEventForm Component
 *
 * This React component handles creating new events for organizers.
 * It collects fields like title, description, date, times, location, capacity, ticket type, category, and organization.
 * On submission, it posts the event data to the backend and redirects to the organizer dashboard.
 */

import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Forms.css";
import LoadingIndicator from "./LoadingIndicator";

function EventForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [ticketType, setTicketType] = useState("free"); 
  const [category, setCategory] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/events/", {
        title,
        description,
        date,
        start_time: startTime,
        end_time: endTime,
        location,
        capacity,
        ticket_type: ticketType,
        category,
        organization,
        approval_status: "pending",
      });

      alert("Event created! Awaiting admin approval.");
      navigate("/organizer");
    } catch (error) {
      console.error(error.response?.data);
      alert("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Create New Event</h1>

      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-input"
        required
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="form-input"
        rows={3}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="form-input"
        required
      />

      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="form-input"
        required
      />

      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="form-input"
        required
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="form-input"
        required
      />

      <input
        type="number"
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        className="form-input"
        required
      />

      <select
        value={ticketType}
        onChange={(e) => setTicketType(e.target.value)}
        className="form-input"
      >
        <option value="free">Free</option>
        <option value="paid">Paid</option>
      </select>

      <input
        type="text"
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="form-input"
      />

      <input
        type="text"
        placeholder="Organization (optional)"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        className="form-input"
      />

      {loading && <LoadingIndicator />}

      <button type="submit" className="form-button">
        Create Event
      </button>
    </form>
  );
}

export default EventForm;
