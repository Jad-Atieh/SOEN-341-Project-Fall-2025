import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 for redirect

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 hook to navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/events"); // redirect to events list
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "300px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  input: {
    marginBottom: "1rem",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    background: "#4a90e2",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default Login;