/**
 * Form Component
 *
 * Handles both user login and signup forms.
 * On login: stores JWT tokens in localStorage and redirects to the events page.
 * On signup: redirects to login after successful registration.
 */

import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Forms.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Sign Up";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data =
        method === "login"
          ? { email, password }
          : { name: username, email, password, role };

      const res = await api.post(route, data);

      if (method === "login") {
        // ✅ Store tokens and user info
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Redirect to events page
        navigate("/");
      } else {
        // Signup → go to login page
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>

      {method === "signup" && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
          required
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
        required
      />

      {method === "signup" && (
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-input"
        >
          <option value="student">Student</option>
          <option value="organizer">Organizer</option>
        </select>
      )}

      {loading && <LoadingIndicator />}

      <button type="submit" className="form-button">
        {name}
      </button>
    </form>
  );
}

export default Form;

