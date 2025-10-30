import React, { useState } from "react";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: 1,
    price: 0,
  });

  const [message, setMessage] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    console.log("Event saved:", form);
    setMessage("✅ Event saved successfully (demo only)");
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Create a New Event</h1>
        <form className="form" onSubmit={onSubmit}>
          <label>Title</label>
          <input name="title" value={form.title} onChange={onChange} required />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            required
          />

          <label>Date</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={onChange}
            required
          />

          <label>Time</label>
          <input
            name="time"
            type="time"
            value={form.time || "12:00"}
            step="60"
            onChange={onChange}
            required
          />

          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={onChange}
            required
          />

          <label>Ticket Capacity</label>
          <input
            name="capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={onChange}
            required
          />

          <label>Price ($)</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={onChange}
            required
          />

          <button className="btn btn-primary" type="submit">
            Save Event
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "12px", color: "#34d399" }}>{message}</p>
        )}
      </section>
    </main>
  );
}