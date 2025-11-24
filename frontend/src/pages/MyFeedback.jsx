import React, { useState, useEffect } from 'react';
import { feedbackService } from '../api';
import '../styles/PageStyle.css';
import { Link } from 'react-router-dom';

const MyFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const fetchMyFeedback = async () => {
    try {
      const response = await feedbackService.getMyFeedback();
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="student-loading">Loading your feedback...</div>;

  return (
    <div className="student-dashboard">
      <div className="student-header">
        <h1>Your Feedback</h1>
        <p>Review the feedback you've provided for events.</p>
      </div>

      <div className="page-navigation">
        <Link to="/student" className="nav-button inactive">
          All Events
        </Link>
        <Link to="/student/tickets" className="nav-button inactive">
          My Tickets
        </Link>
        <Link to="/my-feedback" className="nav-button active">
          My Feedback
        </Link>
      </div>

      <div className="events-grid">
        {feedback.length === 0 ? (
          <div className="student-no-events">
            You haven't submitted any feedback yet. Attend events and check in to leave feedback!
          </div>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="event-card-new">
              <div className="event-card-header">
                <h3>{item.event_title}</h3>
              </div>

              <div className="event-details-grid">
                <div className="detail-group">
                  <span className="detail-label">Your Rating</span>
                  <span className="detail-value">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={i < item.rating ? "star filled" : "star empty"}
                      >
                        ★
                      </span>
                    ))}
                    <span style={{ marginLeft: '0.5rem' }}>
                      ({item.rating}/5)
                    </span>
                  </span>
                </div>
                {item.comment && (
                  <div className="detail-group">
                    <span className="detail-label">Your Comment</span>
                    <span className="detail-value comment-display">
                      "{item.comment}"
                    </span>
                  </div>
                )}
                <div className="detail-group">
                  <span className="detail-label">Submitted</span>
                  <span className="detail-value">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyFeedback;