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
from django.utils import timezone
from rest_framework import generics, permissions, status, exceptions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Ticket, AuditLog
from .serializers import (RegisterSerializer, UserSerializer, EventSerializer, TicketSerializer, MyTokenObtainPairSerializer)
from .permissions import (IsAdmin,IsOrganizer, IsStudent, IsStudentOrOrganizerOrAdmin)

# Get custom user model
User = get_user_model()

# ------------------------------------
# USER REGISTRATION
# ------------------------------------
class CreateUserView(generics.CreateAPIView):
    """
    Handles new user registration.

    Behavior:
    - All new users (students or organizers) are automatically created as:
        status='pending', is_active=False
    - Admin must later approve the user to become 'active' or mark as 'suspended'.

    Access:
    - Public (Anyone can register)
    """

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # Anyone can register (no login required)

    def get(self, request, *args, **kwargs):
        """Prevent DRF browser from crashing when visiting signup via GET."""
        return Response({"message": "Use POST to register a new user."})

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
# USER LOGIN (JWT)
# ------------------------------------
class LoginUserView(APIView):
    """
    Handles JWT-based login for users.

    Behavior:
    - Authenticates user credentials (email & password)
    - Returns JWT access + refresh tokens if valid
    - Denies login for invalid credentials

    Access:
    - Public (Anyone can log in with valid credentials)
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, email=email, password=password)
        
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
# EVENT MANAGEMENT (LIST + CREATE)
# ------------------------------------
class EventListCreateView(generics.ListCreateAPIView):
    """
    Manages all event listings and event creation.

    Behavior:
    - GET: Returns all events, with optional filters by date, category, or organization
    - POST: Allows only organizers to create new events (auto-linked to their account)

    Access:
    - GET: Public (no login required) — shows only approved events
    - POST: Organizers only
    """

    serializer_class = EventSerializer

    def get_permissions(self):
        """Allow public access for GET; restrict POST to organizers."""
        if self.request.method == 'POST':
            return [IsOrganizer()]  # Only organizers can create
        return [AllowAny()]  # Public can view events

    def perform_create(self, serializer):
        """Automatically assign the current user as the event organizer."""
        serializer.save(organizer=self.request.user, approval_status='pending')

    def get_queryset(self):
        """Supports filtering by date, category, or organization."""
        queryset = Event.objects.all()
        user = self.request.user

        # 1. Public (not logged in)
        if not user.is_authenticated:
            queryset = queryset.filter(approval_status='approved')

        # 2. Students: see only approved events
        elif user.role == 'student':
            queryset = queryset.filter(approval_status='approved')

        # 3. Organizers: see all their own events
        elif user.role == 'organizer':
            queryset = queryset.filter(organizer=user)

        # 4. Admins: see all events
        elif user.role == 'admin':
            queryset = queryset.all()

        # Filter options for convenience
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
    Manages actions for individual events.

    Behavior:
    - GET: Any user can view event details
    - PUT/PATCH/DELETE: Only organizers can edit or delete their events

    Access:
    - GET: Public
    - PUT/PATCH/DELETE: Organizers only
    """

    serializer_class = EventSerializer

    def get_permissions(self):
        """Control access by role and request type."""
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsOrganizer()]
        return [AllowAny()]

    def get_queryset(self):
        """Retrieve events."""
        return Event.objects.all()

# ------------------------------------
# TICKET CLAIM (STUDENTS ONLY)
# ------------------------------------
class ClaimTicketView(generics.CreateAPIView):
    """
    Allows students to claim tickets for specific events.

    Rules:
    - Only students can claim tickets.
    - Event capacity is enforced.
    - Prevents duplicate ticket claims per event.

    Access:
    - Students only.
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
# ADMIN USER MANAGEMENT (LIST USERS)
# ------------------------------------
class UserListView(generics.ListAPIView):
    """
    Allows admins to view all registered users in the system.

    Access:
    - Admins only.
    """

    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all()

# ------------------------------------
# USERS MANAGEMENT (APPROVE / SUSPEND / RESET)
# ------------------------------------
class ManageUserStatusView(APIView):
    """
    Allows Admins to manage user account statuses.

    Behavior:
    - Approve (set to active)
    - Suspend (set to suspended)
    - Reset (set to pending)

    Lookup Methods:
    - By ID
    - By Email
    - By Name

    Access:
    - Admins only.
    """

    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all()

    def patch(self, request, *args, **kwargs):
        """Approve, suspend, or reset user status in one API call."""
        user_id = request.data.get("id")
        email = request.data.get("email")
        name = request.data.get("name")
        new_status = request.data.get("status")

        # Validate input
        if not new_status or new_status not in ["active","suspended","pending"]:
            return Response({"error":"Invalid status. Use active/suspended/pending."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Locate user
        user = None
        if user_id:
            user = User.objects.filter(id=user_id).first()
        elif email:
            user = User.objects.filter(email__iexact=email.strip()).first()
        elif name:
            user = User.objects.filter(name__icontains=name.strip()).first()

        if not user:
            return Response({"error":"User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update status and activation
        user.status = new_status
        user.is_active = (new_status == "active")
        user.save()

        return Response({
            "message": f"User '{user.name}' status set to '{new_status}'.",
            "user": UserSerializer(user).data
        })

# ------------------------------------
# EVENTS MANAGEMENT
# ------------------------------------
class ManageEventStatusView(APIView):
    """
    Allows Admins to approve or reject events created by organizers.

    Behavior:
    - PATCH: Update event's approval status (approved/rejected)
    - Logs approval/rejection in AuditLog table

    Access:
    - Admins only.
    """
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return Event.objects.all()

    def update(self, request, *args, **kwargs):
        event = self.get_object()
        new_status = request.data.get('status')

        # Validate status input
        if new_status not in ['approved', 'pending', 'rejected']:
            return Response({"error": "Invalid status. Must be 'approved', 'pending', or 'rejected'."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Retrieve event
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update approval state
        event.approval_status = new_status
        event.is_approved = (new_status == "approved")
        event.approved_by = request.user
        event.approved_at = timezone.now()
        event.save()

        # Log approval/rejection in audit trail
        AuditLog.objects.create(
            admin=request.user,
            target_event=event,
            action="approve_event" if new_status == "approved" else "reject_event",
        )

        return Response({
            "id": event.id,
            "title": event.title,
            "status": event.status,
            "message": f"Event successfully set to '{new_status}'."
        }, status=status.HTTP_200_OK)

# ------------------------------------
# ORGANIZER EVENT UPDATE (NO STATUS CHANGE)
# ------------------------------------
class OrganizerUpdateEventView(generics.UpdateAPIView):
    """
    Allows organizers to update their own event details,
    but they cannot modify the event's status.

    Access:
    - Organizer only.
    """

    serializer_class = EventSerializer
    permission_classes = [IsOrganizer]

    def get_queryset(self):
        """
        Restrict organizers to only their own events.
        Admins cannot use this endpoint.
        """
        return Event.objects.filter(organizer=self.request.user)

    def update(self, request, *args, **kwargs):
        """
        Remove 'status' from incoming data so it cannot be changed.
        """
        data = request.data.copy()
        data.pop('status', None)  # Prevent organizers from changing status

        # Retrieve event (must belong to the organizer)
        event = self.get_object()

        # Perform partial update (PATCH)
        serializer = self.get_serializer(event, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "id": event.id,
            "title": event.title,
            "updated_fields": list(data.keys()),
            "message": "Event updated successfully (status unchanged)."
        }, status=status.HTTP_200_OK)
    
# ------------------------------------
# JWT TOKEN VIEW CUSTOMIZATION
# ------------------------------------
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer