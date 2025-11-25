import axios from "axios";

const API_URL = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    // Or handle this case as per your app's logic, e.g., redirect to login
    throw new Error("No access token found.");
  }
  return { Authorization: `Bearer ${token}` };
};

export const adminApi = {
  async listPendingOrganizers() {
    const response = await axios.get(`http://localhost:8000/api/users`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async approveOrganizer(email) {
    const response = await axios.patch(`http://localhost:8000/api/users/manage/`, {
      email: email,
      status: "active"
    },
    {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async rejectOrganizer(email) {
    const response = await axios.patch(`http://localhost:8000/api/users/manage/`, {
      email: email,
      // FIXME: check for the correct status
      status: "suspended"
    }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getGlobalAnalytics() {
    const response = await axios.get(`http://localhost:8000/api/analytics/global`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async listPendingEvents() {
    const response = await axios.get(`http://localhost:8000/api/events`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async approveEvent(eventId) {
    const response = await axios.patch(`${API_URL}/events/manage/${eventId}/`, {
      status: "approved"
    }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async rejectEvent(eventId) {
    const response = await axios.patch(`${API_URL}/events/manage/${eventId}/`, {
      status: "rejected"
    }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

};
