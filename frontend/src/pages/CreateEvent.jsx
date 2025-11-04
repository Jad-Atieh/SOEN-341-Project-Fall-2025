import { useState } from "react";
import "./create-event.css";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    time: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.location) return;
    setLoading(true);
    try {
      const saved = JSON.parse(localStorage.getItem("draftEvents") || "[]");
      const id = crypto.randomUUID();
      saved.push({ id, ...form, capacity: 100, taken: 0, category: "General" });
      localStorage.setItem("draftEvents", JSON.stringify(saved));
      setForm({
        title: "",
        date: new Date().toISOString().slice(0, 10),
        time: "",
        location: "",
        description: "",
      });
      alert("Event saved locally. You can display it on the Events page.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ce">
      <div className="ce-card">
        <h1 className="ce-title">Create Event</h1>
        <form className="ce-form" onSubmit={onSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={onChange}
          />
          <div className="ce-row">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
            />
            <input
              type="time"
              name="time"
              placeholder="HH:MM"
              value={form.time}
              onChange={onChange}
            />
          </div>
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={onChange}
          />
          <textarea
            name="description"
            placeholder="Short description..."
            value={form.description}
            onChange={onChange}
          />
          <button className="ce-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}