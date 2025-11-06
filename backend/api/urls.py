"""
urls.py
---------
Purpose:
Defines all API endpoints (routes) for the backend.

Each path() maps a specific URL to its corresponding view class,
which handles the HTTP logic (GET, POST, PATCH, DELETE, etc.)
based on the user’s role and permissions.

Structure:
- User Authentication & Registration
- Admin User Management
- Event Management
- Ticket Management
- JWT Authentication (Token & Refresh)
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import (
    CreateUserView,
    LoginUserView,
    EventListCreateView,
    EventDetailView,
    UserListView,
    ClaimTicketView,
    MyTokenObtainPairView,
    ManageUserStatusView,
    ManageEventStatusView,
    OrganizerUpdateEventView,
    EventAnalyticsView,
    CheckInTicketView,
    ExportTicketsCSVView,
)

urlpatterns = [
    # -------------------------------
    # USER AUTHENTICATION & REGISTRATION
    # -------------------------------
    path("user/signup/",CreateUserView.as_view(),name="signup"),
    # Endpoint: POST /api/user/signup/
    # → Registers a new user (student or organizer).

    path("user/login/", LoginUserView.as_view(), name="login"),
    # Endpoint: POST /api/user/login/
    # → login existing user.


    # -------------------------------
    # ADMIN USER MANAGEMENT
    # -------------------------------
    path("users/",UserListView.as_view(),name="user-list"),
    # Endpoint: GET /api/users/
    # → Admin can view all users.

    path("users/manage/", ManageUserStatusView.as_view(), name="manage-user-status"),
    # Endpoint: PATCH /api/users/manage/<id>/
    # → Admin can manage a pending organizer account.
    # Example:
    # {
    #   "email": "jane@example.com",
    #   "status": "active"
    # }

    # -------------------------------
    # EVENT MANAGEMENT
    # -------------------------------
    path("events/",EventListCreateView.as_view(),name="event-list-create"),
    # Endpoint:
    # - GET /api/events/ → List all events (with filters)
    # - POST /api/events/ → Create a new event (organizers only)

    path("events/<int:pk>/",EventDetailView.as_view(),name="event-detail"),
    # Endpoint:
    # - GET /api/events/<id>/ → Retrieve event details
    # - PUT/PATCH /api/events/<id>/ → Update event (organizers only)
    # - DELETE /api/events/<id>/ → Delete event (organizers/admins)

    path("events/organizer/<int:pk>/", OrganizerUpdateEventView.as_view(), name="organizer-event-update"),
    # Endpoint:
    # - PATCH /api/events/organizer/<id>/
    # → Organizer-only endpoint to update their own events
    # → Cannot modify event status (admin handles approval)

    path("events/manage/<int:event_id>/", ManageEventStatusView.as_view(), name="approve-event"),
    # Endpoint:
    # - PATCH /api/events/manage/<event_id>/
    # Example:
    # {
    #   "status": "approved"
    # }

    path('events/<int:event_id>/analytics/', EventAnalyticsView.as_view(), name='event-analytics'),
    # Endpoint: GET /api/events/<event_id>/analytics/
    # → Returns analytics for a specific event.

    # -------------------------------
    # TICKET MANAGEMENT
    # -------------------------------
    path("tickets/claim/",ClaimTicketView.as_view(),name="claim-ticket"),
    # Endpoint: POST /api/tickets/claim/
    # → Allows students to claim tickets for an event.

    # -------------------------------
    # JWT AUTHENTICATION (LOGIN & TOKEN REFRESH)
    # -------------------------------
    path("token/",MyTokenObtainPairView.as_view(),name="get_token"),
    # Endpoint: POST /api/token/
    # → Authenticates user and returns access + refresh JWT tokens.

    path("token/refresh/",TokenRefreshView.as_view(),name="refresh"),
    # Endpoint: POST /api/token/refresh/
    # → Refreshes the JWT access token when it expires.

    path("tickets/checkin/", CheckInTicketView.as_view(), name="checkin-ticket"),
    # Endpoint: POST /api/tickets/checkin/
    # → Allows an organizer or admin to check in an attendee using the QR code.

    path("tickets/export/<int:event_id>/", ExportTicketsCSVView.as_view(), name="export-tickets"),
    # Endpoint: GET /api/tickets/export/<event_id>/
    # → Exports all tickets for a specific event as a CSV file.
]