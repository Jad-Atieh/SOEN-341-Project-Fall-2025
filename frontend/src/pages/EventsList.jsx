import { useMemo, useState } from "react";
import "./events-list.css";

const seed = [
  { id: "e1", title: "AI Workshop", category: "Workshops", date: "2025-11-12", time: "14:00", location: "Hall A", capacity: 100, taken: 100, description: "Hands-on intro to ML." },
  { id: "e2", title: "Career Fair", category: "Career", date: "2025-11-15", time: "10:00", location: "Gym", capacity: 500, taken: 445, description: "Meet employers." },
  { id: "e3", title: "Hackathon", category: "Competitions", date: "2025-11-22", time: "09:00", location: "Lab 3", capacity: 80, taken: 60, description: "24h coding." },
  { id: "e4", title: "Guest Lecture", category: "Talks", date: "2025-11-18", time: "16:30", location: "Auditorium", capacity: 200, taken: 30, description: "Speaker from industry." }
];

export default function EventsList() {
  const stored = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("draftEvents") || "[]"); } catch { return []; }
  }, []);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const events = useMemo(() => [...stored, ...seed], [stored]);
  const cats = useMemo(() => ["All", ...Array.from(new Set(events.map(e => e.category)))], [events]);

  const filtered = events.filter(e => {
    const okCat = cat === "All" || e.category === cat;
    const q = query.trim().toLowerCase();
    const okQ = !q || e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
    return okCat && okQ;
  });

  return (
    <div className="el">
      <div className="el-head">
        <h1 className="el-title">Browse Events</h1>
        <div className="el-filters">
          <input className="el-search" placeholder="Search title or location…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="el-select" value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="el-grid">
        {filtered.map(e => {
          const soldOut = e.taken >= e.capacity;
          const ratio = e.capacity ? e.taken / e.capacity : 0;
          const showRemaining = !soldOut && ratio >= 0.85;
          const remaining = e.capacity - e.taken;

          return (
            <div className="el-card" key={e.id}>
              <div className="el-card-top">
                <span className="el-cat">{e.category}</span>
                {soldOut && <span className="el-badge el-soldout">Sold out</span>}
                {showRemaining && <span className="el-badge el-low">{remaining} seats left</span>}
              </div>
              <h3 className="el-name">{e.title}</h3>
              <p className="el-desc">{e.description}</p>
              <div className="el-meta">
                <span>{e.date}</span>
                <span>{e.time}</span>
                <span>{e.location}</span>
              </div>
              <div className="el-cap">
                <div className="el-bar">
                  <div className="el-fill" style={{ width: `${Math.min(100, Math.round(ratio * 100))}%` }} />
                </div>
                <span className="el-captext">{e.taken}/{e.capacity}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="el-empty">No events match your filters.</div>
        )}
      </div>
    </div>
  );
}