import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function CreateEvent() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [desc, setDesc] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const payload = { title, start_time: start, description: desc };
      const created = await api("/events/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const id = created?.id;
      if (id) nav(`/events/${id}`);
      else nav("/events");
    } catch (ex) {
      setErr(ex?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-container">
      <h1>Create Event</h1>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Start time
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} />
        </label>
        <button disabled={busy}>{busy ? "Saving…" : "Create"}</button>
      </form>
    </main>
  );
}