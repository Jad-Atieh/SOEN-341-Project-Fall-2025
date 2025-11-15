export function fetchOrganizerEvents() {
  const events = [
    {
      id: 1,
      name: "Tech Conference 2025",
      date: "2025-11-30",
      location: "Montreal",
      ticketsSold: 150,
      revenue: 4500,
    },
    {
      id: 2,
      name: "Student Networking Night",
      date: "2025-12-05",
      location: "Concordia EV",
      ticketsSold: 90,
      revenue: 1350,
    },
  ];

  return Promise.resolve(events);
}

export function fetchOrganizerAnalytics() {
  const analytics = {
    totalEvents: 2,
    totalTickets: 240,
    totalRevenue: 5850,
  };

  return Promise.resolve(analytics);
}

export function fetchEventQrData(eventId) {
  const value = `https://localhost:8000/api/events/${eventId}/checkin`;
  return Promise.resolve({ value });
}