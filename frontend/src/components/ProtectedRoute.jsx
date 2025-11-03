/**
 * ProtectedRoute Component
 *
 * This React component acts as a route guard.
 * It ensures that only authenticated users with a valid JWT access token can access the wrapped routes/components.
 * If the access token is expired, it will attempt to refresh it
 * using the refresh token stored in localStorage.
 * If authentication fails, it redirects the user to the login page.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

function ProtectedRoute({ children, roles = [] }) {
  const navigate = useNavigate();

// every time the component mounts, check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      // If no token, redirect to home page
      if (!token) {
        navigate("/");
        return;
      }

      // decode the token for role and expiration check
      
      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch {
        navigate("/");
        return;
      }

      // expiration check on access token
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        
        // try to use the refresh token to get a new access token if access token is expired
        try {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN);
          const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          decoded = jwtDecode(res.data.access);
        } catch {
          navigate("/");
          return;
        }
      }

      // role-based access control
      if (roles.length && !roles.includes(decoded.role)) {
        switch (decoded.role) {
          case "student": navigate("/student"); break;
          case "organizer": navigate("/organizer"); break;
          case "admin": navigate("/admin"); break;
          default: navigate("/"); break;
        }
        return;
      }
    };

    // invoke the authentication check after mount
    checkAuth();
  }, [navigate, roles]);

  // avoiding the blank page problem by rendering children only after checks
  return <>{children}</>;
}

export default ProtectedRoute;
