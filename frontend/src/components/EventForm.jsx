import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Forms.css"; 

function EventForm({ eventId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(eventId ? true : false);

  
let role = null;
const accessToken = localStorage.getItem("access");

if (accessToken) {
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    role = payload.role;
  } catch (err) {
    console.error("Failed to decode token:", err);
  }
}

  const [form, setForm] = useState({
    title: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    capacity: "",
    description: "",
    approval_status: "pending",
  });

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${eventId}/`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (eventId) {
        await api.put(`/api/events/${eventId}/`, form);
      } else {
        await api.post("/api/events/", form);
      }

      
      if (role === "organizer") {
        navigate("/organizer");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); 
      }

    } catch (err) {
      console.error(err);
      alert("Error saving event");
    }
  };

  if (loading) return <p className="loading-indicator">Loading...</p>;

  return (
    <div className="form-container">
      <h1>{eventId ? "Edit Event" : "Create Event"}</h1>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>

        <input
          className="form-input"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          className="form-input"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          className="form-input"
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />

        <input
          className="form-input"
          type="time"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />

        <input
          className="form-input"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          className="form-input"
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-input"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        {eventId && (
          <select
            className="form-input"
            name="approval_status"
            value={form.approval_status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        )}

        <button className="form-button" type="submit">
          {eventId ? "Save Changes" : "Create Event"}
        </button>

      </form>
    </div>
  );
}

export default EventForm;
