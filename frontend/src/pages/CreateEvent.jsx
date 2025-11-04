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

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: brancher sur ton backend plus tard
      console.log("CreateEvent payload:", form);
      alert("Event created (demo)");
      setForm((f) => ({ ...f, title: "", time: "", location: "", description: "" }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ce">
      <div className="ce-card">
        <h1 className="ce-title">Create Event</h1>
        <form className="ce-form" onSubmit={onSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={onChange} />
          <div className="ce-row">
            <input name="date" type="date" value={form.date} onChange={onChange} />
            <input name="time" placeholder="HH:MM" value={form.time} onChange={onChange} />
          </div>
          <input name="location" placeholder="Location" value={form.location} onChange={onChange} />
          <textarea name="description" placeholder="Short description..." value={form.description} onChange={onChange} />
          <button className="ce-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
