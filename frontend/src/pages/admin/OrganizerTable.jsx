import React, { useEffect, useState } from "react";
import { adminApi } from "./adminApi";
import Table from "../../components/Table";

const OrganizerTable = ({ search }) => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

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

      // Remove the organizer after action
      setOrganizers((prev) => prev.filter((o) => o.id !== organizer.id));
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
    { header: "Name", accessor: "name" },
    { header: "Organization", accessor: "orgName" },
    { header: "Email", accessor: "email" },
    {
      header: "Submitted",
      accessor: "submittedAt",
    },
    { header: "Status", accessor: "status" },
  ];

  // Prepare table data
  const tableData = filtered.map((o) => ({
    ...o,
    submittedAt: new Date(o.submittedAt).toLocaleDateString(),
    status: o.status || "pending",
  }));

  // Define approve/reject actions
  const actions = [
    {
      label: "Approve",
      onClick: (o) => handleAction(o, "approve"),
      type: "approve",
    },
    {
      label: "Reject",
      onClick: (o) => handleAction(o, "reject"),
      type: "reject",
    },
  ];


  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Organizers</h2>

      {filtered.length > 0 ? (
        <Table
          columns={columns}
          data={tableData}
          actions={actions}
        />
      ) : (
        <p>No pending organizers.</p>
      )}
    </div>
  );
};

export default OrganizerTable;
