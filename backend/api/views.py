"""
views.py
---------
Purpose:
This file defines the views (API endpoints) that handle HTTP requests (GET, POST, PUT, DELETE).

Each class below corresponds to a specific API endpoint and defines:
 - what data it accepts (via serializers)
 - who can access it (via permissions)
 - what logic runs when a request is made
"""

from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, exceptions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Ticket
from .serializers import (RegisterSerializer, UserSerializer, EventSerializer, TicketSerializer)
from .permissions import (IsAdmin,IsOrganizer, IsStudent, IsStudentOrOrganizerOrAdmin)

# Get custom user model
User = get_user_model()

# ------------------------------------
# USER REGISTRATION
# ------------------------------------
class CreateUserView(generics.CreateAPIView):
    """
    Handles new user registration.
    - All new users (students or organizers) are created with:
        status='pending', is_active=False
    - Admin must approve users to 'active' or 'suspended'.
    """

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # Anyone can register (no login required)

    def create(self, request, *args, **kwargs):
        """Custom response after successful registration."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "status": user.status,
            "message": "Account created successfully. Awaiting admin approval."
        }, status=status.HTTP_201_CREATED)

# ------------------------------------
# EVENT MANAGEMENT (LIST + CREATE)
# ------------------------------------
class EventListCreateView(generics.ListCreateAPIView):
    """
    Handles listing and creating events.
    - GET: Any logged-in user can view events.
    - POST: Only organizers can create new events.
    """

    serializer_class = EventSerializer

    def get_permissions(self):
        """Dynamically assign permissions based on request type."""
        if self.request.method == 'POST':
            return [IsOrganizer()]  # Only organizers can create
        return [IsStudentOrOrganizerOrAdmin()]  # All authenticated users can view

    def perform_create(self, serializer):
        """Automatically assign the current user as the event organizer."""
        serializer.save(organizer=self.request.user)

    def get_queryset(self):
        """Supports filtering by date, category, or organization."""
        queryset = Event.objects.all()
        date = self.request.query_params.get('date')
        category = self.request.query_params.get('category')
        organization = self.request.query_params.get('organization')

        if date:
            queryset = queryset.filter(date=date)
        if category:
            queryset = queryset.filter(category__icontains=category)
        if organization:
            queryset = queryset.filter(organization__icontains=organization)

        return queryset

# ------------------------------------
# EVENT DETAIL (RETRIEVE + UPDATE + DELETE)
# ------------------------------------
class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles individual event actions.
    - GET: All authenticated users can view.
    - PUT/PATCH/DELETE: Only organizers can modify or delete events.
    """

    serializer_class = EventSerializer

    def get_permissions(self):
        """Control access by role and request type."""
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsOrganizer()]
        return [IsStudentOrOrganizerOrAdmin()]

    def get_queryset(self):
        """Retrieve events."""
        return Event.objects.all()

# ------------------------------------
# TICKET CLAIM (STUDENTS ONLY)
# ------------------------------------
class ClaimTicketView(generics.CreateAPIView):
    """
    Allows students to claim tickets for events.
    - Only students can claim.
    - Prevents duplicates and over-capacity claims.
    """

    serializer_class = TicketSerializer
    permission_classes = [IsStudent]

    def perform_create(self, serializer):
        """Validate ticket claim and enforce event capacity."""
        event_id = self.request.data.get('event')

        if not event_id:
            raise exceptions.ValidationError({"event": "This field is required."})

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise exceptions.NotFound("Event not found.")

        # Ensure event capacity not exceeded
        if Ticket.objects.filter(event=event).count() >= event.capacity:
            raise exceptions.ValidationError({"detail": "Event capacity reached."})

        # Prevent duplicate claims
        if Ticket.objects.filter(event=event, user=self.request.user).exists():
            raise exceptions.ValidationError({"detail": "You have already claimed a ticket for this event."})

        # Save ticket with the current user
        serializer.save(user=self.request.user, event=event)

# ------------------------------------
# ADMIN USER MANAGEMENT
# ------------------------------------
class UserListView(generics.ListAPIView):
    """
    Allows admins to view all registered users.
    """

    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all()


class ApproveOrganizerView(generics.UpdateAPIView):
    """
    Allows admins to approve suspended organizer accounts.
    - Only admins can approve.
    """

    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        """Only show organizers waiting for approval."""
        return User.objects.filter(status='pending')

    def perform_update(self, serializer):
        """Approve an organizer (activate their account)."""
        serializer.save(status='active', is_active=True)