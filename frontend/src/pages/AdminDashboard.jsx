import React from "react";
import "../styles/PageStyle.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div>AdminDashboard
        <Link to="/approval"><button>Approval</button></Link>
        </div>
    );
};
export default AdminDashboard