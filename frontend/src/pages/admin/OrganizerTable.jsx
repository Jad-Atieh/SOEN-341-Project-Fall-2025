import React, { useEffect, useState } from "react";
import { adminApi } from "./adminApi";

const OrganizerTable = ({ search }) => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listPendingOrganizers().then((data) => {
      setOrganizers(data);
      setLoading(false);
    }).catch(error => {
      console.error("Failed to fetch pending organizers:", error);
      setLoading(false);
    });
  }, []);

  const handleAction = async (id, email, action) => {
    if (action === "approve") {
      await adminApi.approveOrganizer(email);
    } else {
      await adminApi.rejectOrganizer(email);
    }
    setOrganizers((prev) => prev.filter((o) => o.id !== id));
  };

  const filtered = organizers.filter(o =>
    (o.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (o.orgName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (o.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  if (loading) return <p>Loading organizers...</p>;

  return (
    <div className="table-wrapper">
      <table className="org-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Organization</th>
            <th>Email</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length > 0 ? filtered.map((o) => (
            <tr key={o.id}>
              <td>{o.name}</td>
              <td>{o.orgName}</td>
              <td>{o.email}</td>
              <td>{new Date(o.submittedAt).toLocaleDateString()}</td>
              <td className="action-buttons">
                <button className="approve" onClick={() => handleAction(o.id, o.email, "approve")}>✔ Approve</button>
                <button className="reject" onClick={() => handleAction(o.id, o.email, "reject")}>✖ Reject</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5">No pending organizers.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizerTable;
