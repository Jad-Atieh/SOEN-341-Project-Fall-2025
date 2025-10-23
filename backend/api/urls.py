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
    path("user/signup/", CreateUserView.as_view(), name="signup"),
    path("login/", LoginUserView.as_view(), name="login"),  # custom JWT login

    # -------------------------------
    # ADMIN USER MANAGEMENT
    # -------------------------------
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/approve/<int:pk>/", ApproveOrganizerView.as_view(), name="approve-organizer"),

    # -------------------------------
    # EVENT MANAGEMENT
    # -------------------------------
    path("events/", EventListCreateView.as_view(), name="event-list-create"),
    path("events/<int:pk>/", EventDetailView.as_view(), name="event-detail"),

    # -------------------------------
    # TICKET MANAGEMENT
    # -------------------------------
    path("tickets/claim/", ClaimTicketView.as_view(), name="claim-ticket"),

    # -------------------------------
    # JWT AUTHENTICATION (LOGIN & TOKEN REFRESH)
    # -------------------------------
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
]
