import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

function useAuthInfo() {
  const [info, setInfo] = useState({ authed: false, role: null });
  useEffect(() => {
    const t = localStorage.getItem(ACCESS_TOKEN);
    if (!t) return setInfo({ authed: false, role: null });
    try {
      const d = jwtDecode(t);
      const now = Date.now() / 1000;
      if (d.exp && d.exp < now) setInfo({ authed: false, role: null });
      else setInfo({ authed: true, role: d.role || null });
    } catch {
      setInfo({ authed: false, role: null });
    }
  }, []);
  return info;
}

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { authed, role } = useAuthInfo();

  const isOrganizer = useMemo(() => authed && role === "organizer", [authed, role]);

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderBottom: "1px solid #eee" }}>
      <Link to="/" className={pathname === "/" ? "active" : ""}>Home</Link>
      <Link to="/events" className={pathname.startsWith("/events") ? "active" : ""}>Events</Link>
      {isOrganizer && (
        <>
          <Link to="/create-event" className={pathname.startsWith("/create-event") ? "active" : ""}>Create Event</Link>
          <Link to="/organizer" className={pathname.startsWith("/organizer") ? "active" : ""}>Organizer</Link>
        </>
      )}
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        {!authed ? (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Signup</button>
          </>
        ) : (
          <button onClick={() => { localStorage.clear(); navigate("/"); }}>Sign Out</button>
        )}
      </div>
    </nav>
  );
}