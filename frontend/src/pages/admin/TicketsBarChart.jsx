import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TicketsBarChart({ data }) {
    // Data for a single grouped bar
    const chartData = {
        labels: ["Tickets"],
        datasets: [
            {
                label: "Total",
                data: [data.total],
                backgroundColor: "#6A1B9A",
            },
            {
                label: "Active",
                data: [data.active],
                backgroundColor: "#8E24AA",
            },
            {
                label: "Used",
                data: [data.used],
                backgroundColor: "#AB47BC",
            },
            {
                label: "Cancelled",
                data: [data.cancelled],
                backgroundColor: "#CE93D8",
            },
        ],
    };

    const maxValue =
        Math.max(data.total, data.active, data.used, data.cancelled) * 1.2;

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: maxValue, // smoother spacing above bars
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <div
            style={{
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "white",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
                Tickets Overview
            </h2>
            <Bar data={chartData} options={options} />
        </div>
    );
}
