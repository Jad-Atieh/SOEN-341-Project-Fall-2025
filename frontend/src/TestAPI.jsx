import React, { useEffect, useState } from "react";
import api from "./api";

function TestAPI() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Example: Fetch from Django's /api/events/
    api.get("events/")
      .then(response => {
        console.log("API Response:", response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error("API Error:", error);
      });
  }, []);

  return (
    <div>
      <h2>Backend API Test</h2>
      {data.length > 0 ? (
        <ul>
          {data.map((event, i) => (
            <li key={i}>{event.title || JSON.stringify(event)}</li>
          ))}
        </ul>
      ) : (
        <p>No data yet (check console for API response)</p>
      )}
    </div>
  );
}

export default TestAPI;
