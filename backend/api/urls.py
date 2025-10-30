"""
urls.py
---------
Purpose:
Defines all API endpoints (routes) for the backend.

Each path() maps a specific URL to a corresponding view,
which handles the logic for that request (GET, POST, PUT, DELETE, etc.).
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .views import (
    CreateUserView,
    LoginUserView,
    EventListCreateView,
    EventDetailView,
    UserListView,
    ClaimTicketView,
    ApproveOrganizerView,
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

    path("users/approve/<int:pk>/",ApproveOrganizerView.as_view(),name="approve-organizer"),
    # Endpoint: PATCH /api/users/approve/<id>/
    # → Admin can approve a pending organizer account.


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


    # -------------------------------
    # TICKET MANAGEMENT
    # -------------------------------
    path("tickets/claim/",ClaimTicketView.as_view(),name="claim-ticket"),
    # Endpoint: POST /api/tickets/claim/
    # → Allows students to claim tickets for an event.

    # -------------------------------
    # DASHBOARD
    # -------------------------------
    path('dashboard/student/', student_dashboard, name='student-dashboard'),

    # -------------------------------
    # JWT AUTHENTICATION (LOGIN & TOKEN REFRESH)
    # -------------------------------
    path("token/",TokenObtainPairView.as_view(),name="get_token"),
    # Endpoint: POST /api/token/
    # → Authenticates user and returns access + refresh JWT tokens.

    path("token/refresh/",TokenRefreshView.as_view(),name="refresh"),
    # Endpoint: POST /api/token/refresh/
    # → Refreshes the JWT access token when it expires.
]