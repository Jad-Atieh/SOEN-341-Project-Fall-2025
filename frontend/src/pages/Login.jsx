import React, { useState } from "react";
import { loginUser } from "./api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      localStorage.setItem("token", response.data.access);
      alert("Login successful!");
    } catch (error) {
      alert("Invalid credentials!");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
