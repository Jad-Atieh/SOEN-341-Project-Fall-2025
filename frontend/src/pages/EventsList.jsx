import React, { useEffect, useState } from "react";
import api from "../api"; 
import Table from "../components/Table";

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events/"); 
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Date", accessor: "date" },
    { header: "Start Time", accessor: "start_time" },
    { header: "End Time", accessor: "end_time" },
    { header: "Location", accessor: "location" },
    { header: "Capacity", accessor: "capacity" },
    { header: "Status", accessor: "approval_status" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>

      {events.length > 0 ? (
        <Table columns={columns} data={events} />
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
}

export default EventList;
