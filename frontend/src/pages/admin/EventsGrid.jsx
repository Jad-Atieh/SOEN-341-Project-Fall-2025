import React, { useEffect, useState } from "react";
import { adminApi } from "./adminApi";
import Table from "../../components/Table";

const EventsGrid = ({ search }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending events on mount
  useEffect(() => {
    adminApi
      .listPendingEvents()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch pending events:", error);
        setLoading(false);
      });
  }, []);

  // Handle remove after approve/reject
  const handleAction = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Approve event
  const approveEvent = async (event) => {
    try {
      await adminApi.approveEvent(event.id);
      handleAction(event.id);
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  // Reject event
  const rejectEvent = async (event) => {
    try {
      await adminApi.rejectEvent(event.id);
      handleAction(event.id);
    } catch (error) {
      console.error("Error rejecting event:", error);
    }
  };

  // Filter events by search term
  const filtered = events.filter((e) =>
    (e.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (e.organizer?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (e.location?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) return <p>Loading events...</p>;

  // Define columns for Table
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Organizer", accessor: "organizerName" },
    { header: "Date", accessor: "date" },
    { header: "Start Time", accessor: "start_time" },
    { header: "Location", accessor: "location" },
    { header: "Tickets Requested", accessor: "capacity" },
  ];

  // Map events into table-friendly rows
  const tableData = filtered.map((e) => ({
    ...e,
    organizerName: e.organizer?.name || "N/A",
  }));

  // Define approve/reject actions
  const actions = [
    { label: "Approve", onClick: approveEvent, type: "approve" },
    { label: "Reject", onClick: rejectEvent, type: "reject" },
  ];

  return (
    <div className="p-4">
      {filtered.length > 0 ? (
        <Table columns={columns} data={tableData} actions={actions} />
      ) : (
        <p>No pending events to moderate.</p>
      )}
    </div>
  );
};

export default EventsGrid;
