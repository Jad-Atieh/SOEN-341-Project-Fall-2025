import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { feedbackService } from "../api";
import StarRating from "../components/StarRating";
import "../styles/PageStyle.css";

function EventFeedback() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canProvideFeedback, setCanProvideFeedback] = useState(false);

  useEffect(() => {
    checkFeedbackEligibility();
    fetchEventDetails();
  }, [eventId]);

  const checkFeedbackEligibility = async () => {
    try {
      const response = await feedbackService.canProvideFeedback(eventId);
      setCanProvideFeedback(response.data.can_provide_feedback);
      if (!response.data.can_provide_feedback) {
        navigate("/student");
      }
    } catch (error) {
      console.error("Error checking feedback eligibility:", error);
      navigate("/student");
    }
  };

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/api/events/${eventId}/`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      await feedbackService.submitFeedback(eventId, {
        rating: rating,
        comment: comment
      });
      
      alert("Thank you for your feedback!");
      navigate("/my-feedback");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(error.response?.data?.detail || "Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="student-loading">Loading...</div>;
  }

  if (!event) {
    return <div className="student-no-events">Event not found.</div>;
  }

  return (
    <div className="student-dashboard">
      <div className="student-header">
        <h1>Leave Feedback</h1>
        <p>Share your experience with this event</p>
      </div>

      <div className="page-navigation">
        <Link to="/student" className="nav-button inactive">
          All Events
        </Link>
        <Link to="/student/tickets" className="nav-button inactive">
          My Tickets
        </Link>
        <Link to="/my-feedback" className="nav-button inactive">
          My Feedback
        </Link>
      </div>

      <div className="feedback-page-container">
        <div className="event-summary-card">
          <h2>{event.title}</h2>
          <div className="event-details">
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.start_time} - {event.end_time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Organizer:</strong> {event.organization}</p>
          </div>
        </div>

        <div className="feedback-form-card">
          <h3>How was your experience?</h3>
          <form onSubmit={handleSubmitFeedback} className="feedback-form">
            <div className="form-section">
              <label className="form-label">Overall Rating *</label>
              <StarRating 
                rating={rating} 
                setRating={setRating}
                size="large"
              />
            </div>

            <div className="form-section">
              <label className="form-label">Detailed Review (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience... What did you like about the event? What could be improved? Any suggestions for future events?"
                rows="6"
                className="comment-textarea"
              />
              <div className="character-count">
                {comment.length}/500 characters
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/student")}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rating === 0 || submitting}
                className="btn-primary"
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventFeedback;