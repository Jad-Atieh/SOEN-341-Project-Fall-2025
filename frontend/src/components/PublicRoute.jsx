import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function PublicRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (!accessToken) {
        return;
      }

      let decoded;
      try {
        decoded = jwtDecode(accessToken);
      } catch {
        localStorage.removeItem(ACCESS_TOKEN);
        return;
      }

      const now = Date.now() / 1000;

      // If access token expired, try to refresh
      if (decoded.exp < now) {
        if (!refreshToken) {
          localStorage.removeItem(ACCESS_TOKEN);
          return;
        }

        // Try to get a new access token using the refresh token
        try {
          const res = await api.post("/api/token/refresh/", {
            refresh: refreshToken,
          });
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          decoded = jwtDecode(res.data.access);
        } catch {
          localStorage.clear();
          return;
        }
      }

        // Redirect based on role
      switch (decoded.role) {
        case "student":
          navigate("/student");
          break;
        case "organizer":
          navigate("/organizer");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
          break;
      }
    };

    checkAuth();
  }, [navigate]);

  return <>{children}</>;
}

export default PublicRoute;
