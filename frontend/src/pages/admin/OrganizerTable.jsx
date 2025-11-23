import React, { useEffect, useState } from "react";
import { adminApi } from "./adminApi";
import AdminTable from "./AdminTable";

const OrganizerTable = ({ search }) => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate actions based on each row's status
  const getActionsForRow = (row) => {
    const status = row.status?.toLowerCase();

    if (status === "active") {
      return [
        {
          label: "Reject",
          onClick: () => handleAction(row, "reject"),
          type: "reject",
        },
      ];
    }

    if (status === "suspended") {
      return [
        {
          label: "Approve",
          onClick: () => handleAction(row, "approve"),
          type: "approve",
        },
      ];
    }

    // pending → show both
    return [
      {
        label: "Approve",
        onClick: () => handleAction(row, "approve"),
        type: "approve",
      },
      {
        label: "Reject",
        onClick: () => handleAction(row, "reject"),
        type: "reject",
      },
    ];
  };




  useEffect(() => {
    adminApi
      .listPendingOrganizers()
      .then((data) => {
        setOrganizers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch pending organizers:", error);
        setLoading(false);
      });
  }, []);

  const handleAction = async (organizer, action) => {
    try {
      if (action === "approve") {
        await adminApi.approveOrganizer(organizer.email);
      } else {
        await adminApi.rejectOrganizer(organizer.email);
      }

      // Update UI instantly
      setOrganizers((prev) =>
        prev.map((o) =>
          o.id === organizer.id
            ? { ...o, status: action === "approve" ? "active" : "suspended" }
            : o
        )
      );


    } catch (error) {
      console.error(`Failed to ${action} organizer:`, error);
    }
  };

  // Filter by search term
  const filtered = organizers.filter((o) =>
    (o.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (o.orgName?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (o.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) return <p>Loading organizers...</p>;

  // Define columns for the Table component
  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status" }
  ];

  // Prepare table data
  const tableData = filtered.map((o) => ({
    ...o,
    status: o.status || "pending",
  }));


  return (
    <div>
      {filtered.length > 0 ? (
        <AdminTable
          columns={columns}
          data={tableData}
          getActions={getActionsForRow}
        />
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default OrganizerTable;
