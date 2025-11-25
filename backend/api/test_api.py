from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Event, Ticket, User
import datetime

# -----------------------------
# Helper function to create users
# -----------------------------
def create_user(email, role='student', password='password123', is_active=True):
    user = User.objects.create_user(
        email=email,
        password=password,
        role=role,
        name=email.split('joe@joe')[0],  # simple name
        status='active' if is_active else 'pending'
    )
    return user


# -----------------------------
# TICKET CHECK-IN TESTS
# -----------------------------
class TicketCheckInTests(TestCase):
    def setUp(self):
        # Users
        self.organizer = create_user(email='org@test.com', role='organizer')
        self.student = create_user(email='student@test.com', role='student')

        # Event
        now = timezone.now()
        self.event = Event.objects.create(
            title="Test Event",
            description="This is a test event",
            date=now.date(),
            start_time=now.time(),
            end_time=(now + datetime.timedelta(hours=2)).time(),
            location="Test Location",
            status="approved",
            capacity=100,
            organizer=self.organizer
        )

        # Ticket
        self.ticket = Ticket.objects.create(
            event=self.event,
            user=self.student,
            qr_code="VALID_QR_12345",
            status='active'
        )

        # API client
        self.client = APIClient()
        self.client.force_authenticate(user=self.organizer)

    def test_checkin_ticket_success(self):
        response = self.client.post(
            '/api/tickets/checkin/',
            {'qr_code': self.ticket.qr_code},
            format='json'
        )
        print("Success response:", response.status_code, getattr(response, 'data', response.content))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, 'used')
        print("Test succeeded: test_checkin_ticket_success")

    def test_checkin_ticket_invalid_qr(self):
        response = self.client.post(
            '/api/tickets/checkin/',
            {'qr_code': 'INVALID_QR'},
            format='json'
        )
        print("Invalid QR response:", response.status_code, getattr(response, 'data', response.content))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        print("Test succeeded: test_checkin_ticket_invalid_qr")

    def test_checkin_ticket_already_used(self):
        self.ticket.status = 'used'
        self.ticket.save()
        response = self.client.post(
            '/api/tickets/checkin/',
            {'qr_code': self.ticket.qr_code},
            format='json'
        )
        print("Already used response:", response.status_code, getattr(response, 'data', response.content))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('This ticket has already been used.', str(getattr(response, 'data', '')))
        print("Test succeeded: test_checkin_ticket_already_used")

    def test_checkin_unauthorized_user(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(
            '/api/tickets/checkin/',
            {'qr_code': self.ticket.qr_code},
            format='json'
        )
        print("Unauthorized response:", response.status_code, getattr(response, 'data', response.content))
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        print("Test succeeded: test_checkin_unauthorized_user")

    def test_checkin_ticket_inactive(self):
        self.ticket.status = 'inactive'
        self.ticket.save()
        response = self.client.post(
            '/api/tickets/checkin/',
            {'qr_code': self.ticket.qr_code},
            format='json'
        )
        print("Inactive ticket response:", response.status_code, getattr(response, 'data', response.content))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, 'used')
        print("Test succeeded: test_checkin_ticket_inactive")


# -----------------------------
# ADMIN USER MANAGEMENT TESTS
# -----------------------------
class AdminUserManagementTests(TestCase):
    def setUp(self):
        self.admin = create_user(email='admin@test.com', role='admin')
        self.pending_organizer = create_user(email='pending@test.com', role='organizer', is_active=False)
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin)

    def test_approve_user_status(self):
        response = self.client.patch(
            '/api/users/manage/',
            {'email': self.pending_organizer.email, 'status': 'active'},
            format='json'
        )
        print("Approve user response:", response.status_code, getattr(response, 'data', response.content))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("Test succeeded: test_approve_user_status")

    def test_suspend_user_status(self):
        response = self.client.patch(
            '/api/users/manage/',
            {'email': self.pending_organizer.email, 'status': 'suspended'},
            format='json'
        )
        print("Suspend user response:", response.status_code, getattr(response, 'data', response.content))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("Test succeeded: test_suspend_user_status")


# -----------------------------
# ORGANIZER EVENT TESTS
# -----------------------------
class OrganizerEventTests(TestCase):
    def setUp(self):
        self.organizer = create_user(email='org1@test.com', role='organizer')
        self.other_organizer = create_user(email='org2@test.com', role='organizer')
        now = timezone.now()
        self.event = Event.objects.create(
            title="Own Event",
            description="Organizer own event",
            date=now.date(),
            start_time=now.time(),
            end_time=(now + datetime.timedelta(hours=2)).time(),
            location="Test Location",
            status="pending",
            capacity=100,
            organizer=self.organizer
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.organizer)

    def test_update_own_event_success(self):
        response = self.client.patch(
            f'/api/events/organizer/{self.event.id}/',
            {'description': 'Updated description'},
            format='json'
        )
        print("Update own event response:", response.status_code, getattr(response, 'data', response.content))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("Test succeeded: test_update_own_event_success")

    def test_update_other_organizer_event_forbidden(self):
        self.client.force_authenticate(user=self.other_organizer)
        response = self.client.patch(
            f'/api/events/organizer/{self.event.id}/',
            {'description': 'Malicious update'},
            format='json'
        )
        print("Update other event response:", response.status_code, getattr(response, 'data', response.content))
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])
        print("Test succeeded: test_update_other_organizer_event_forbidden")

# -----------------------------
# ORGANIZER CANNOT CHANGE STATUS TEST
# -----------------------------
class OrganizerCannotChangeStatusTests(TestCase):
    def setUp(self):
        self.organizer = create_user(email='org3@test.com', role='organizer')
        now = timezone.now()

        self.event = Event.objects.create(
            title="Status Test Event",
            description="Event for testing status updates",
            date=now.date(),
            start_time=now.time(),
            end_time=(now + datetime.timedelta(hours=1)).time(),
            location="Test Location",
            status="pending",
            capacity=100,
            organizer=self.organizer
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.organizer)

    def test_organizer_cannot_change_status(self):
        response = self.client.patch(
            f'/api/events/organizer/{self.event.id}/',
            {'status': 'approved'},   # THIS SHOULD NOT BE ALLOWED
            format='json'
        )

        # Should still succeed but ignore status change
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Confirm status did NOT change
        self.event.refresh_from_db()
        self.assertEqual(self.event.status, "pending")

        print("Test succeeded: Organizer cannot change event status")

