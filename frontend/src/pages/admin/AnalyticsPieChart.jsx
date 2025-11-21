import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom tooltip for neat display
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          border: "1px solid #EEE",
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].name}</p>
        <p style={{ margin: "5px 0 0", color: "#555" }}>
          Value: <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPieChart({ title, data, roles }) {
  const COLORS = ["#6A1B9A", "#a451baff", "#c872d7ff", "#FDCFFA"];

  // Only for USERS overview
  const [mode, setMode] = useState("status"); // 'status' or 'role'

  // Prepare role data when needed
  const roleData =
    roles &&
    Object.entries(roles).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));

  // Determine which data to show
  const chartData =
    title === "Users Overview" && mode === "role" ? roleData : data;

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "14px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        background: "white",
        position: "relative",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "12px" }}>{title}</h2>

      {/* Toggle only for Users Overview chart */}
      {title === "Users Overview" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setMode("status")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #6A1B9A",
              background: mode === "status" ? "#6A1B9A" : "white",
              color: mode === "status" ? "white" : "#6A1B9A",
              cursor: "pointer",
            }}
          >
            Status
          </button>

          <button
            onClick={() => setMode("role")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #6A1B9A",
              background: mode === "role" ? "#6A1B9A" : "white",
              color: mode === "role" ? "white" : "#6A1B9A",
              cursor: "pointer",
            }}
          >
            Role
          </button>
        </div>
      )}

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            label={({ name, value, percent }) =>
              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={false}
            paddingAngle={3}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
