import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL // base url taken from the env
});

//to be used before every request. Follows the api.interceptors.request(SUCCESS, ERROR) format
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Feedback API functions
export const feedbackService = {
  // Check if user can provide feedback for an event
  canProvideFeedback: (eventId) => 
    api.get(`/api/events/${eventId}/can-provide-feedback/`),

  // Submit feedback for an event
  submitFeedback: (eventId, data) => 
    api.post(`/api/events/${eventId}/feedback/`, data),

  // Get user's feedback for a specific event
  getEventFeedback: (eventId) => 
    api.get(`/api/events/${eventId}/feedback/`),

  // Get all feedback submitted by the user
  getMyFeedback: () => 
    api.get('/api/my-feedback/'),
    
  // Get events available for feedback
  getEventsForFeedback: () =>
    api.get('/api/events-for-feedback/'),
};

export default api;