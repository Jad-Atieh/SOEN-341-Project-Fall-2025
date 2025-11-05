import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

export default function ProtectedRoute({ children, roles = [] }) {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    async function run() {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) return navigate("/login");

      let decoded;
      try { decoded = jwtDecode(token); } catch { return navigate("/login"); }

      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        try {
          const refresh = localStorage.getItem(REFRESH_TOKEN);
          const res = await api.post("/api/token/refresh/", { refresh });
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          decoded = jwtDecode(res.data.access);
        } catch { return navigate("/login"); }
      }

      if (roles.length && !roles.includes(decoded.role)) {
        if (decoded.role === "organizer") navigate("/organizer");
        else if (decoded.role === "student") navigate("/student");
        else navigate("/");
        return;
      }

      setOk(true);
    }
    run();
  }, [navigate, roles]);

  return ok ? children : null;
}