import React, { useState, useEffect } from "react";
import "../styles/Forms.css";
import EventForm from "../components/EventForm";
import { useParams } from "react-router-dom";

function EditEvent() {
  const { id } = useParams();
  return <EventForm eventId={id} />;
}


export default EditEvent;
