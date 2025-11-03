import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

function OrganizerApproval() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    adminApi.listPendingOrganizers().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const act = async (id, kind) => {
    if (kind === "approve") await adminApi.approveOrganizer(id);
    else await adminApi.rejectOrganizer(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  if (loading) return <p>Loading organizers...</p>;

  return (
    <div>
      <h2>Pending Organizers</h2>
      <table border="1" cellPadding="5">
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
          {items.map((o) => (
            <tr key={o.id}>
              <td>{o.name}</td>
              <td>{o.orgName}</td>
              <td>{o.email}</td>
              <td>{o.submittedAt}</td>
              <td>
                <button onClick={() => act(o.id, "approve")}>Approve</button>
                <button onClick={() => act(o.id, "reject")}>Reject</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan="5">No pending organizers.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default OrganizerApproval;
