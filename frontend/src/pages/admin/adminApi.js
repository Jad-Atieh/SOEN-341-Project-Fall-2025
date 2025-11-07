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

  async approveOrganizer(organizerId, email) {
    const response = await axios.patch(`http://localhost:8000/api/users/manage/`, {
      email: email,
      status: "active"
    },
    {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async rejectOrganizer(organizerId) {
    const response = await axios.post(`${API_URL}/users/approve/${organizerId}/`, {
      email: email,
      // FIXME: check for the correct status
      status: "reject"
    }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getGlobalAnalytics() {
    const response = await axios.get(`${API_URL}/admin/analytics`, {
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
