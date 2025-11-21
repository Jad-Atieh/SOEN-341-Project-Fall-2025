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
    organization: "",
    category: "",
    ticket_type: "free",
  });

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${eventId}/`);
        setForm({
          title: res.data.title,
          date: res.data.date,
          start_time: res.data.start_time,
          end_time: res.data.end_time,
          location: res.data.location,
          capacity: res.data.capacity,
          description: res.data.description,
          organization: res.data.organization,
          category: res.data.category,
          ticket_type: res.data.ticket_type || "free",
        });
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
      const payload = {
        ...form,
        approval_status: "pending",
      };

      if (eventId) {
        await api.put(`/api/events/${eventId}/`, payload);
      } else {
        await api.post("/api/events/", payload);
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

        <input
          className="form-input"
          name="organization"
          placeholder="Organization"
          value={form.organization}
          onChange={handleChange}
          required
        />

        <input
          className="form-input"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <select
          className="form-input"
          name="ticket_type"
          value={form.ticket_type}
          onChange={handleChange}
          required
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        <button className="form-button" type="submit">
          {eventId ? "Save Changes" : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default EventForm;
