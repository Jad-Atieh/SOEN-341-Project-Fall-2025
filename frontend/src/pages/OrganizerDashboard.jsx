import React, { useMemo } from "react";
import { Link } from "react-router-dom";

function readEvents() {
  try {
    const raw = localStorage.getItem("draftEvents") || "[]";
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function toPercent(a, b) {
  if (!b || b <= 0) return 0;
  return Math.min(100, Math.round((a / b) * 100));
}

function downloadCSV(filename, rows) {
  const header = Object.keys(rows[0] || {}).join(",");
  const body = rows.map(r =>
    Object.values(r)
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  ).join("\n");
  const csv = header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function OrganizerDashboard() {
  const events = useMemo(() => readEvents(), []);

  const totals = useMemo(() => {
    let count = events.length;
    let capacity = 0;
    let sold = 0;
    events.forEach(e => {
      const cap = Number(e.capacity || 0);
      const tk = Number(e.taken || 0);
      capacity += cap;
      sold += tk;
    });
    return { count, capacity, sold, fill: toPercent(sold, capacity) };
  }, [events]);

  const handleExport = () => {
    const rows = events.map(e => ({
      id: e.id || "",
      title: e.form?.title || e.title || "",
      date: e.form?.date || e.date || "",
      time: e.form?.time || e.time || "",
      location: e.form?.location || e.location || "",
      category: e.form?.category || e.category || "",
      capacity: e.capacity ?? "",
      taken: e.taken ?? "",
      remaining: Math.max(0, Number(e.capacity || 0) - Number(e.taken || 0)),
      sold_out: Number(e.taken || 0) >= Number(e.capacity || 0) ? "yes" : "no",
    }));
    downloadCSV("events.csv", rows);
  };

  return (
    <div style={{ maxWidth: 960, margin: "24px auto", padding: "0 16px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Organizer Dashboard</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/create-event"><button>Create Event</button></Link>
          <button onClick={handleExport}>Export CSV</button>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Events</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{totals.count}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Tickets Sold</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{totals.sold}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Capacity</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{totals.capacity}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Overall Fill</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{totals.fill}%</div>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 12px" }}>Events</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {events.length === 0 && <div>No events yet.</div>}
          {events.map(e => {
            const title = e.form?.title || e.title || "Untitled";
            const date = e.form?.date || e.date || "";
            const time = e.form?.time || e.time || "";
            const loc  = e.form?.location || e.location || "";
            const desc = e.form?.description || e.description || "";
            const cap = Number(e.capacity || 0);
            const tk  = Number(e.taken || 0);
            const remain = Math.max(0, cap - tk);
            const pct = toPercent(tk, cap);
            const soldOut = cap > 0 && tk >= cap;
            const nearly = !soldOut && cap > 0 && pct >= 85;

            return (
              <div key={e.id || title} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <h3 style={{ margin: 0 }}>{title}</h3>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {soldOut && <span style={{ padding: "2px 8px", borderRadius: 999, background: "#eee" }}>Sold out</span>}
                    {nearly && <span style={{ padding: "2px 8px", borderRadius: 999, background: "#eee" }}>{remain} seats left</span>}
                    <Link to={`/create-event?id=${encodeURIComponent(e.id || "")}`}>
                      <button>Edit Event</button>
                    </Link>
                  </div>
                </div>

                <div style={{ fontSize: 14, marginTop: 6 }}>
                  <div><strong>Date:</strong> {date} {time}</div>
                  <div><strong>Location:</strong> {loc}</div>
                  {desc && <div style={{ marginTop: 6 }}>{desc}</div>}
                </div>

                {cap > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>Sold {tk}/{cap} ({pct}%)</div>
                    <div style={{ height: 8, background: "#f1f1f1", borderRadius: 6 }}>
                      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 6, background: "#4a6cf7" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ display: "flex", gap: 12 }}>
        <Link to="/organizer/analytics"><button>Analytics</button></Link>
        <Link to="/organizer/checkin"><button>QR Check-in</button></Link>
      </section>
    </div>
  );
}