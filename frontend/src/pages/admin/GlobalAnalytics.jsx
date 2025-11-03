import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

export default function GlobalAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    adminApi.getGlobalAnalytics().then(setData);
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div>
      <h2>Global Analytics</h2>
      <p>Total Users: {data.totalUsers}</p>
      <p>Total Events: {data.totalEvents}</p>
      <p>Tickets Issued: {data.ticketsIssued}</p>
      <p>Revenue: ${data.revenue}</p>
    </div>
  );
}
