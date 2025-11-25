import React, { useEffect, useState } from "react";
import { adminApi } from "./adminApi";
import AdminTable from "./AdminTable";
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

  const approveEvent = async (event) => {
    try {
      await adminApi.approveEvent(event.id);

      // Update local state
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, status: "approved" } : e
        )
      );
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  const rejectEvent = async (event) => {
    try {
      await adminApi.rejectEvent(event.id);

      // Update local state
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, status: "rejected" } : e
        )
      );
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
    { header: "Status", accessor: "status" }
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

  const getActionsForRow = (row) => {
    const status = row.status?.toLowerCase();

    if (status === 'approved') {
      return [
        {
          label: "Reject",
          onClick: () => rejectEvent(row),
          type: "reject"
        }
      ]
    }
    if (status === 'rejected') {
      return [
        {
          label: "Approve",
          onClick: () => approveEvent(row),
          type: "approve"
        }
      ]
    }
    if (status === 'pending') {
      return [
        { label: "Approve", onClick: () => approveEvent(row), type: "approve" },
        { label: "Reject", onClick: () => rejectEvent(row), type: "reject" },
      ];
    }

  }

  return (
    <div className="p-4">
      {filtered.length > 0 ? (
        <AdminTable
          data={tableData}
          columns={columns}
          getActions={getActionsForRow}
        />
      ) : (
        <p>No events to moderate.</p>
      )}
    </div>
  );
};

export default EventsGrid;
