import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function readLocalEvents() {
  try { const raw = localStorage.getItem("draftEvents") || "[]"; const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; } catch { return []; }
}

export default function OrganizerAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let ok = true;
    fetch(`${API_BASE}/api/analytics`, { credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(j => { if (ok) setData(j); })
      .catch(() => {
        const ev = readLocalEvents();
        const perEvent = ev.map(e => {
          const title = e.form?.title || e.title || "Untitled";
          const cap = Number(e.capacity || 0);
          const sold = Number(e.taken || 0);
          const remaining = Math.max(0, cap - sold);
          return { title, sold, capacity: cap, remaining };
        });
        const timeline = ev.map((e, i) => {
          const d = e.form?.date || e.date || `2025-11-${String(i + 1).padStart(2, "0")}`;
          const sold = Number(e.taken || 0);
          return { date: d, sold };
        });
        setData({ perEvent, timeline });
      });
    return () => { ok = false; };
  }, []);

  const perEvent = useMemo(() => data?.perEvent || [], [data]);
  const timeline = useMemo(() => (data?.timeline || []).sort((a,b)=>String(a.date).localeCompare(String(b.date))), [data]);

  return (
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px", display: "grid", gap: 24 }}>
      <h1 style={{ margin: 0 }}>Analytics</h1>

      <section style={{ height: 320, border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
        <h3 style={{ margin: "0 0 12px" }}>Tickets per Event</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={perEvent}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" interval={0} angle={-15} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sold" name="Sold" />
            <Bar dataKey="capacity" name="Capacity" />
            <Bar dataKey="remaining" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section style={{ height: 320, border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
        <h3 style={{ margin: "0 0 12px" }}>Sales Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sold" name="Sold" />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}