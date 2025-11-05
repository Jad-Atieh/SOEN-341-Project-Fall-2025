import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#eef4ff,#ffffff)" }}>
      <h1 style={{ fontSize: 48, color: "#1d4ed8", marginBottom: 8 }}>Welcome to Campus Events!</h1>
      <p style={{ color: "#334155", marginBottom: 32 }}>Sign in or sign up to discover upcoming events, workshops, and activities.</p>
      <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.1)", width: 420, maxWidth: "90%" }}>
        <h2 style={{ textAlign: "center", marginBottom: 16, color: "#1e3a8a" }}>Get Started</h2>
        <p style={{ textAlign: "center", color: "#475569", marginBottom: 20 }}>You need to be logged in to access events, dashboards, and account features.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link to="/login" style={{ background: "#2563eb", color: "white", padding: "10px 18px", borderRadius: 8, textDecoration: "none" }}>Login</Link>
          <Link to="/signup" style={{ background: "#1e40af", color: "white", padding: "10px 18px", borderRadius: 8, textDecoration: "none" }}>Signup</Link>
        </div>
      </div>
    </div>
  );
}