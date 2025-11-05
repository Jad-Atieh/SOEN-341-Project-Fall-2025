import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || "http://localhost:8000";
    fetch(`${base}/api/events/`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => setEvents(Array.isArray(data) ? data : data.results || []))
      .catch(e => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!events.length) return <div className="p-6">No events.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Events</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map(ev => {
          const capacity = Number(ev.capacity || ev.max_capacity || 0);
          const sold = Number(ev.tickets_sold || ev.sold || 0);
          const remaining = Math.max(capacity - sold, 0);
          const percent = capacity > 0 ? sold / capacity : 0;
          const soldOut = capacity > 0 && remaining === 0;
          const showRemaining = !soldOut && percent >= 0.85 && remaining > 0;

          return (
            <div key={ev.id || ev.slug || ev.uuid || ev.title} className="border rounded-lg p-4">
              <h2 className="text-lg font-medium">{ev.title || ev.name}</h2>
              <p className="text-sm opacity-80">{ev.date || ev.start_time || ev.starts_at || ""}</p>
              <p className="text-sm">{ev.location || ev.venue || ""}</p>
              {soldOut && <p className="mt-2 text-red-600 font-semibold">Sold out</p>}
              {showRemaining && <p className="mt-2 text-orange-600 font-medium">{remaining} seats left</p>}
              <div className="mt-3 flex gap-2">
                <Link to={`/event/${ev.id || ev.slug || ev.uuid || ""}`} className="px-3 py-1 border rounded">
                  Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}