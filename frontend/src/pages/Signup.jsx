import React from "react";
import UserForm from "../components/UserForm"; 
import { Link } from "react-router-dom";
import "../styles/Forms.css"; 
import "../styles/PageStyle.css";

function Signup() {
  return (
    <div className="student-dashboard">
      <div className="student-header">
        <h1>Join Campus Events!</h1>
        <p>Create an account to browse events and claim tickets</p>
      </div>

      <div className="page-navigation">
        <Link to="/login" className="nav-button inactive">
          Login
        </Link>
        <Link to="/" className="nav-button inactive">
          Events
        </Link>
        <Link to="/signup" className="nav-button active">
          Signup
        </Link>
      </div>

      <UserForm route="/api/user/signup/" method="signup" />
    </div>
  );
}

export default Signup;
