import React from "react";
import UserForm from "../components/UserForm"; 
import '../styles/Forms.css'; 


function Login() {
    return <UserForm route="/api/token/" method="login" />
}

export default Login;