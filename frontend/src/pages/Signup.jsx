import React from "react";
import UserForm from "../components/UserForm";
import '../styles/Forms.css'; 

function Signup() {
    return <UserForm route="/api/user/signup/" method="signup" />
}

export default Signup