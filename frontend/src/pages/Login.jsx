import React from "react";
import UserForm from "../components/UserForm"; 
import { Link } from "react-router-dom";
import "../styles/Forms.css"; 
import "../styles/PageStyle.css";

function Login() {
  return (
    <div className="student-dashboard">
      {/* --------- HEADER --------- */}
      <div className="student-header">
        <h1>Welcome Back!</h1>
        <p>Login to access your account and view campus events</p>
      </div>

      {/* --------- NAVIGATION BUTTONS --------- */}
      <div className="page-navigation">
        <Link to="/login" className="nav-button active">
          Login
        </Link>
        <Link to="/" className="nav-button inactive">
          Events
        </Link>
        <Link to="/signup" className="nav-button inactive">
          Signup
        </Link>
      </div>

      {/* --------- LOGIN FORM --------- */}
      <UserForm route="/api/token/" method="login" />
      </div>
      
  );
}

export default Login;
