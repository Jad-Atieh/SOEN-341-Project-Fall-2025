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
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import generics, permissions, status, exceptions, authentication
from django.db.models.functions import TruncMonth, Coalesce
from django.utils.timezone import now
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Ticket, AuditLog, EventFeedback
from .serializers import (RegisterSerializer, UserSerializer, EventSerializer, TicketSerializer, MyTokenObtainPairSerializer, EventFeedbackSerializer)
from .permissions import (IsAdmin,IsOrganizer, IsStudent, IsStudentOrOrganizerOrAdmin)
from django.db.models import Count, Q
from .models import User, Event, Ticket, AuditLog
from .serializers import (RegisterSerializer, UserSerializer, EventSerializer, TicketSerializer, MyTokenObtainPairSerializer)
from django.db.models import Sum, Count, Q, Value, F, FloatField
from .permissions import (IsAdmin,IsOrganizer, IsStudent, IsStudentOrOrganizerOrAdmin, IsOrganizerOrAdmin)
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied
import csv
import numpy as np
import re
from rest_framework.parsers import MultiPartParser, JSONParser


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
        serializer.save(organizer=self.request.user, status='pending')

    def get_queryset(self):
        """Supports filtering by date, category, or organization."""
        queryset = Event.objects.all()
        user = self.request.user

        # 1. Public (not logged in)
        if not user.is_authenticated:
            queryset = queryset.filter(status='approved')

        # 2. Students: see only approved events
        elif user.role == 'student':
            queryset = queryset.filter(status='approved')

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
    - Pending (set to pending)

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
    #queryset = Event.objects.all()  # Needed for UpdateAPIView

    def patch(self, request, *args, **kwargs):
        """Handle PATCH requests to update event approval status."""
        event_id = kwargs.get("event_id")
        new_status = request.data.get('status')

        # Validate status input
        if new_status not in ['approved', 'pending', 'rejected']:
            return Response({"error": "Invalid status. Must be 'approved', 'pending', or 'rejected'."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Find the event by ID
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update approval state
        event.status = new_status
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
            "organizer": event.organizer,
            "submitted": event.created_at,
            "updated_fields": list(data.keys()),
            "message": "Event updated successfully (status unchanged)."
        }, status=status.HTTP_200_OK)
    
# ------------------------------------
# JWT TOKEN VIEW CUSTOMIZATION
# ------------------------------------
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# ------------------------------------
# EVENT ANALYTICS 
# ------------------------------------
class EventAnalyticsView(APIView):
    """
    Returns analytics for a specific event.

    Accessible by:
      - The event organizer
      - Admin users

    Returns:
      - total_tickets: number of claimed tickets
      - checked_in_attendees: number of attendees checked in
      - capacity: max allowed attendees
    """
    permission_classes = [IsAuthenticated, IsStudentOrOrganizerOrAdmin]

    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)

        # Organizer can view
        if not (request.user == event.organizer or request.user.role == "admin"):
            return Response(
                {"error": "You are not authorized to view this event's analytics."},
                status=status.HTTP_403_FORBIDDEN,
            )

        analytics = (
            Event.objects.filter(id=event_id)
            .annotate(
                total_tickets=Count("tickets"),
                checked_in_attendees=Count("tickets", filter=Q(tickets__status="used")),
            )
            .values("id", "title", "capacity", "total_tickets", "checked_in_attendees")
            .first()
        )

        if not analytics:
            analytics = {
                "id": event.id,
                "title": event.title,
                "capacity": event.capacity,
                "total_tickets": 0,
                "checked_in_attendees": 0,
            }

        return Response(analytics, status=status.HTTP_200_OK)

# ------------------------------------
# Check in Ticket View 
# ------------------------------------
class CheckInTicketView(APIView):
    """
    Allows an organizer or admin to check in an attendee using the QR code string.
    Marks the ticket as 'used' and records the check-in time.
    """
    permission_classes = [IsAuthenticated, IsOrganizer | IsAdmin]
    parser_classes = [JSONParser]  

    def post(self, request):
        qr_code = request.data.get("qr_code") 
        if not qr_code:
            return Response({"error": "QR code is required."}, status=400)

        # Extract ticket ID from QR code string
        match = re.search(r'ticket_(\d+)_user_\d+_event_\d+', qr_code)
        if not match:
            return Response({"error": "Invalid QR code format."}, status=400)

        ticket_id = int(match.group(1))

        try:
            ticket = Ticket.objects.get(id=ticket_id)
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found."}, status=404)

        # Only organizer or admin can check in
        if request.user != ticket.event.organizer and not request.user.role == "admin":
            return Response(
                {"error": "You are not authorized to check in attendees for this event."},
                status=403,
            )

        if ticket.status == "used":
            return Response({"message": "This ticket has already been used."}, status=200)

        ticket.status = "used"
        ticket.used_at = timezone.now()
        ticket.save()

        return Response({
            "message": "Ticket successfully checked in.",
            "user": ticket.user.name,
            "event": ticket.event.title,
            "checked_in_at": ticket.used_at,
        }, status=200)


# ------------------------------------
# Export Tickets as CSV
# ------------------------------------
class ExportTicketsCSVView(APIView):
    permission_classes = [IsOrganizerOrAdmin]  # only admin or organizer

    def get(self, request, event_id):
        tickets = Ticket.objects.filter(event_id=event_id).select_related('user', 'event')
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="event_{event_id}_tickets.csv"'

        writer = csv.writer(response)
        writer.writerow(['Student', 'Event', 'Status', 'Claimed At', 'Used At'])
        for t in tickets:
            writer.writerow([
                t.user.name,
                t.event.title,
                t.status,
                t.claimed_at,
                t.used_at or ''
            ])
        return response

# ------------------------------------
# STUDENT DASHBOARD API
# ------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_dashboard(request):
    
    # verify the user is a student
    if request.user.role != 'student':
        return Response(
            {"error": "Unauthorized access."}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    user = request.user
    today = timezone.now().date()
    
    try:
        # get upcoming events (events in future that user has tickets for)
        upcoming_events = Event.objects.filter(
            tickets__user=user,
            tickets__status='active',
            date__gte=today
        ).distinct().order_by('date', 'time')[:5]

        # today's events
        todays_events = Event.objects.filter(
            tickets__user=user,
            tickets__status='active',
            date=today
        ).distinct().order_by('time')

        # ticket counts by status
        ticket_counts = Ticket.objects.filter(user=user).aggregate(
            total_tickets=Count('id'),
            active_tickets=Count('id', filter=Q(status='active')),
            used_tickets=Count('id', filter=Q(status='used')),
            cancelled_tickets=Count('id', filter=Q(status='cancelled'))
        )

        # recent activity (recently claimed tickets)
        recent_tickets = Ticket.objects.filter(user=user).select_related('event').order_by('-claimed_at')[:5]

        # tecommended events (events similar to ones user has tickets for)
        user_event_categories = Event.objects.filter(
            tickets__user=user
        ).values_list('category', flat=True).distinct()

        recommended_events = Event.objects.filter(
            category__in=user_event_categories,
            date__gte=today,
            is_active=True
        ).exclude(
            tickets__user=user  # exclude events user already has tickets for
        ).order_by('?')[:3] if user_event_categories else Event.objects.none()

        # build dashboard response
        dashboard_data = {
            "user_info": {
                "name": user.name,
                "email": user.email,
                "member_since": user.created_at.strftime("%B %Y")
            },
            "quick_stats": {
                "events_today": todays_events.count(),
                "upcoming_events": upcoming_events.count(),
                "active_tickets": ticket_counts['active_tickets'],
                "total_attended": ticket_counts['used_tickets'],
            },
            "ticket_stats": {
                "total": ticket_counts['total_tickets'],
                "active": ticket_counts['active_tickets'],
                "used": ticket_counts['used_tickets'],
            },
            "todays_events": EventSerializer(todays_events, many=True).data,
            "upcoming_events": EventSerializer(upcoming_events, many=True).data,
            "recent_activity": TicketSerializer(recent_tickets, many=True).data,
            "recommended_events": EventSerializer(recommended_events, many=True).data
        }
        
        return Response(dashboard_data)
        
    except Exception as e:
        return Response(
            {"error": "Unable to load dashboard data."}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ------------------------------------
# TICKET MANAGEMENT API
# ------------------------------------

class StudentTicketListView(generics.ListAPIView):
    """
    GET /api/student/tickets
    Returns all tickets for the authenticated student user
    Includes event information and ticket status
    """
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # return only tickets belonging to the current student user
        return Ticket.objects.filter(user=self.request.user).select_related('event')

class StudentTicketDetailView(generics.RetrieveAPIView):
    """
    GET /api/student/tickets/{id}
    Returns individual ticket details for the authenticated student
    Includes full event information and ticket status
    """
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # students can only access their own tickets
        return Ticket.objects.filter(user=self.request.user).select_related('event')

    def get_object(self):
        # get the ticket ID from URL
        ticket_id = self.kwargs.get('id')
        
        # error handling
        ticket = get_object_or_404(
            Ticket, 
            id=ticket_id, 
            user=self.request.user  # ensure user owns the ticket
        )
        return ticket

# ------------------------------------
# GLOBAL ANALYTICS (ADMIN DASHBOARD)
# ------------------------------------
class GlobalAnalyticsView(APIView):
    """
    Provides global analytics for the entire system.
    Accessible by:
      - Admin users only.
    Returns high-level metrics such as:
      - Total users by role and status
      - Event counts by approval status
      - Ticket statistics
      - Top events and organizer performance
    """

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        # --- USERS ---
        total_users = User.objects.count()
        active_users = User.objects.filter(status='active').count()
        pending_users = User.objects.filter(status='pending').count()
        suspended_users = User.objects.filter(status='suspended').count()

        students = User.objects.filter(role='student').count()
        organizers = User.objects.filter(role='organizer').count()
        admins = User.objects.filter(role='admin').count()

        # --- EVENTS ---
        total_events = Event.objects.count()
        approved_events = Event.objects.filter(status='approved').count()
        pending_events = Event.objects.filter(status='pending').count()
        rejected_events = Event.objects.filter(status='rejected').count()

        top_events = (
            Event.objects.annotate(ticket_count=Count('tickets'))
            .order_by('-ticket_count')[:5]
            .values('id', 'title', 'ticket_count', 'category', 'organization')
        )

        # --- TICKETS ---
        total_tickets = Ticket.objects.count()
        active_tickets = Ticket.objects.filter(status='active').count()
        used_tickets = Ticket.objects.filter(status='used').count()
        cancelled_tickets = Ticket.objects.filter(status='cancelled').count()

        # --- ORGANIZER PERFORMANCE ---
        organizer_performance = (
            User.objects.filter(role='organizer')
            .annotate(
                total_events=Count('events'),
                approved_event_count=Count('events', filter=Q(events__status='approved')),  # ✅ fixed
                total_tickets=Count('events__tickets'),
            )
            .values('id', 'name', 'email', 'total_events', 'approved_event_count', 'total_tickets')
            .order_by('-approved_event_count')[:5]
        )

        data = {
            "users": {
                "total": total_users,
                "active": active_users,
                "pending": pending_users,
                "suspended": suspended_users,
                "by_role": {
                    "students": students,
                    "organizers": organizers,
                    "admins": admins,
                },
            },
            "events": {
                "total": total_events,
                "approved": approved_events,
                "pending": pending_events,
                "rejected": rejected_events,
                "top_events": list(top_events),
            },
            "tickets": {
                "total": total_tickets,
                "active": active_tickets,
                "used": used_tickets,
                "cancelled": cancelled_tickets,
            },
            "organizer_performance": list(organizer_performance),
            "generated_at": timezone.now(),
        }

        # ------------------------------------
        # MONTHLY GRAPH DATA (USERS / EVENTS / TICKETS)
        # ------------------------------------
        # Users created per month
        users_by_month = (
            User.objects.annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        # Events created per month
        events_by_month = (
            Event.objects.annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        # Tickets claimed per month
        tickets_by_month = (
            Ticket.objects.annotate(month=TruncMonth('claimed_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        # Collect all months present in any dataset (formatted as 'May', 'Jun', etc.)
        all_months = sorted(list({
            *(u['month'].strftime("%b") for u in users_by_month),
            *(e['month'].strftime("%b") for e in events_by_month),
            *(t['month'].strftime("%b") for t in tickets_by_month),
        }))

        monthly_graph = []
        for m in all_months:
            monthly_graph.append({
                "month": m,
                "users": next((u['count'] for u in users_by_month if u['month'].strftime("%b") == m), 0),
                "events": next((e['count'] for e in events_by_month if e['month'].strftime("%b") == m), 0),
                "tickets": next((t['count'] for t in tickets_by_month if t['month'].strftime("%b") == m), 0),
            })

        # Attach graph data to existing payload
        data["monthly_graph"] = monthly_graph

        return Response(data, status=status.HTTP_200_OK)


# ------------------------------------
# EVENT TICKETS DATA VIEW
# ------------------------------------
class EventTicketsDataView(APIView):

    permission_classes = [IsOrganizerOrAdmin]  # only organizer or admin

    def get(self, request, event_id):
        tickets = Ticket.objects.filter(event_id=event_id).select_related('user', 'event')

        # Build JSON data
        ticket_data = []
        for t in tickets:
            ticket_data.append({
                "student_name": t.user.name,
                "student_email": t.user.email,
                "event_title": t.event.title,
                "status": t.status,
                "claimed_at": t.claimed_at,
                "used_at": t.used_at or None,
            })


        summary = {
            "total_tickets": tickets.count(),
            "claimed_tickets": tickets.filter(status__in=['active', 'used']).count(),
            "used_tickets": tickets.filter(status='used').count(),
            "capacity_left": t.event.capacity - tickets.count() if t.event.capacity else 0,
        }

        return Response({
            "event_id": event_id,
            "event_title": tickets.first().event.title if tickets.exists() else None,
            "summary": summary,
            "tickets": ticket_data
        }, status=200)

# ------------------------------------
# CAN PROVIDE FEEDBACK CHECK API
# ------------------------------------
class CanProvideFeedbackView(APIView):
    """
    Check if user can provide feedback for a specific event
    Returns: {can_provide_feedback: boolean, ticket_id: int|null}
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        try:
            # Check if user has a used ticket for this event
            ticket = Ticket.objects.get(
                event_id=event_id, 
                user=request.user, 
                status='used'
            )
            
            # Check if user already provided feedback
            has_feedback = EventFeedback.objects.filter(
                event_id=event_id, 
                user=request.user
            ).exists()
            
            return Response({
                'can_provide_feedback': not has_feedback,
                'ticket_id': ticket.id if not has_feedback else None
            })
            
        except Ticket.DoesNotExist:
            return Response({
                'can_provide_feedback': False,
                'ticket_id': None
            })

# ------------------------------------
# EVENT FEEDBACK API
# ------------------------------------
class EventFeedbackView(APIView):
    """
    Handle event feedback submission
    POST /api/events/<event_id>/feedback/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        try:
            # Get event for permission checks
            event = get_object_or_404(Event, id=event_id)

            # Check if user has a USED ticket for this event
            ticket = Ticket.objects.filter(
                event=event, 
                user=request.user, 
                status='used'
            ).first()

            if not ticket:
                return Response(
                    {"error": "You may only leave feedback after checking in to the event."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Check for duplicate feedback
            if EventFeedback.objects.filter(event=event, user=request.user).exists():
                return Response(
                    {"error": "You have already provided feedback for this event."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Pass the data directly - event will be set in create method
            serializer = EventFeedbackSerializer(
                data=request.data, 
                context={
                    'request': request,
                    'view': self  # Pass the view for accessing kwargs
                }
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# ------------------------------------
# MY FEEDBACK LIST API
# ------------------------------------
class MyFeedbackListView(generics.ListAPIView):
    """
    Get all feedback submitted by the current user
    """
    serializer_class = EventFeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventFeedback.objects.filter(user=self.request.user).select_related('event')

# ------------------------------------
# EVENTS AVAILABLE FOR FEEDBACK
# ------------------------------------
class EventsForFeedbackView(generics.ListAPIView):
    """
    Get all events that the user can provide feedback for
    (events where user has used tickets but hasn't provided feedback)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        user = self.request.user
        
        # Get events where user has used tickets
        events_with_used_tickets = Event.objects.filter(
            tickets__user=user,
            tickets__status='used'
        ).distinct()

        
        # Exclude events where user already provided feedback
        events_with_feedback = Event.objects.filter(
            feedbacks__user=user
        ).distinct()
        
        return events_with_used_tickets.exclude(id__in=events_with_feedback)

# ------------------------------------
# ORGANIZER FEEDBACK VIEW
# ------------------------------------
class OrganizerFeedbackListView(generics.ListAPIView):
    """
    Return all EventFeedback objects for events that belong to
    the currently authenticated organizer.

    Query params supported (optional):
      - order=newest | oldest    (default newest)
      - event=<event_id>         (filter by a specific event)
    """
    serializer_class = EventFeedbackSerializer
    permission_classes = [IsAuthenticated]  # or [IsOrganizer] if you want to restrict to organizers only

    def get_queryset(self):
        user = self.request.user

        # Base queryset: feedback on events this user organizes
        qs = EventFeedback.objects.filter(event__organizer=user).select_related('event', 'user')

        # Optional filtering by event id
        event_id = self.request.query_params.get('event')
        if event_id:
            try:
                qs = qs.filter(event__id=int(event_id))
            except ValueError:
                pass

        # Optional ordering
        order = self.request.query_params.get('order', 'newest')
        if order == 'oldest':
            qs = qs.order_by('created_at')
        else:
            # default newest
            qs = qs.order_by('-created_at')

        return qs