import React from "react";
import Form from "../components/Form"; // adjust the path if needed
import '../styles/Forms.css'; 

function Login() {
  return <Form route="/api/login/" method="login" />;
}


export default Login;
