/**
 * Form Component
 *
 * This React component handles both user login and signup forms.
 * For signup, it collects username, email, password, and role (student, organizer, admin).
 * For login, it collects email and password only.
 * On login, it stores JWT tokens in localStorage and redirects to the home/events page.
 * On signup, it redirects the user to the login page after successful registration.
 */

import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";


function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
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
          : { username, email, password, role };

      const res = await api.post(route, data);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/"); 
      } else {
        navigate("/login"); 
      }
    } catch (error) {
      alert(error);
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

      <button type="submit" className="form-button">
        {name}
      </button>
    </form>
  );
}

export default Form;
