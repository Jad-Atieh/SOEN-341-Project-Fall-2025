"""
views.py
---------
Purpose:
Handles API requests for user authentication, event management, and ticketing.
"""

from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, permissions, status, exceptions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Ticket
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    EventSerializer,
    TicketSerializer,
)
from .permissions import (
    IsAdmin,
    IsOrganizer,
    IsStudent,
    IsStudentOrOrganizerOrAdmin,
)

User = get_user_model()

# ------------------------------------
# USER REGISTRATION
# ------------------------------------
class CreateUserView(generics.CreateAPIView):
    """
    Handles new user registration.
    - Students → active immediately
    - Organizers → suspended until approved by admin
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status
        }, status=status.HTTP_201_CREATED)


# ------------------------------------
# USER LOGIN (JWT)
# ------------------------------------
class LoginUserView(APIView):
    """Handles JWT login."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": user.name,
                        "role": user.role,
                        "status": user.status,
                    },
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ------------------------------------
# EVENT LIST + CREATE
# ------------------------------------
class EventListCreateView(generics.ListCreateAPIView):
    """
    GET → list all events (authenticated)
    POST → create new event (organizers only)
    """
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsOrganizer()]
        return [IsStudentOrOrganizerOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def get_queryset(self):
        queryset = Event.objects.all()
        date = self.request.query_params.get("date")
        category = self.request.query_params.get("category")
        organization = self.request.query_params.get("organization")

        if date:
            queryset = queryset.filter(date=date)
        if category:
            queryset = queryset.filter(category__icontains=category)
        if organization:
            queryset = queryset.filter(organization__icontains=organization)

        return queryset


# ------------------------------------
# EVENT DETAIL (GET, UPDATE, DELETE)
# ------------------------------------
class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsOrganizer()]
        return [IsStudentOrOrganizerOrAdmin()]

    def get_queryset(self):
        return Event.objects.all()


# ------------------------------------
# CLAIM TICKET (STUDENT ONLY)
# ------------------------------------
class ClaimTicketView(generics.CreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsStudent]

    def perform_create(self, serializer):
        event_id = self.request.data.get("event")
        if not event_id:
            raise exceptions.ValidationError({"event": "This field is required."})

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise exceptions.NotFound("Event not found.")

        if Ticket.objects.filter(event=event).count() >= event.capacity:
            raise exceptions.ValidationError({"detail": "Event capacity reached."})

        if Ticket.objects.filter(event=event, user=self.request.user).exists():
            raise exceptions.ValidationError({"detail": "You already claimed a ticket."})

        serializer.save(user=self.request.user, event=event)


# ------------------------------------
# ADMIN USER MANAGEMENT
# ------------------------------------
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all()


class ApproveOrganizerView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return User.objects.filter(role="organizer", status="suspended")

    def perform_update(self, serializer):
        serializer.save(status="active", is_active=True)
