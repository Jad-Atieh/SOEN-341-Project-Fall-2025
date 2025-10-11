import React from "react";
import Form from "../components/Form";
import '../styles/Forms.css'; 

function Signup() {
    return <Form route="/api/user/signup/" method="signup" />
}

export default Signup