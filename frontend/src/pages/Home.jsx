import React from "react";
import "../styles/style.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Campus Events!</h1>
        <p>Sign in or sign up to discover upcoming events, workshops, and activities.</p>
      </header>

      <div className="home-card">
        <h2>Get Started</h2>
        <p>You need to be logged in to access events, dashboards, and account features.</p>
        <div className="btn-container">
          <Link to="/login"><button>Login</button></Link>
          <Link to="/signup"><button>Signup</button></Link>
        </div>
      </div>
      
    </div>
  );
};

export default Home;