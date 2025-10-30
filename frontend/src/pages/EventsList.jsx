import React from "react";
import "../styles/style.css"; 
import { Link } from "react-router-dom";

const EventsList = () => {
    return (
        <div className="events-container">
            <header className="events-header">
                <h1>Browse Events</h1>
            </header>

            <section className="events">
                <div className="event-card">
                    <h3>Hackathon 2025</h3>
                    <p><strong>Date:</strong> 2025-11-10</p>
                    <p><strong>Location:</strong> Concordia EV Building</p>
                    <p>Collaborate and innovate in our annual student hackathon!</p>
                    <button>Register</button>
                </div>

                <div className="event-card">
                    <h3>Career Fair</h3>
                    <p><strong>Date:</strong> 2025-11-25</p>
                    <p><strong>Location:</strong> Hall Building</p>
                    <p>Meet top recruiters and explore internship opportunities.</p>
                    <button>Register</button>
                </div>

                <div className="event-card">
                    <h3>Wellness Workshop</h3>
                    <p><strong>Date:</strong> 2025-12-03</p>
                    <p><strong>Location:</strong> Online</p>
                    <p>Learn techniques to reduce stress and improve balance.</p>
                    <button disabled>Sold Out</button>
                </div>
            </section>
        </div>
    );
};

export default EventsList;
