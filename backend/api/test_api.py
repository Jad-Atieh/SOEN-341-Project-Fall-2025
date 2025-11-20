from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Event, Ticket, User
import datetime


class TicketCheckInTests(TestCase):
    def setUp(self):
        # Organizer user (authorized for check-in)
        self.organizer = User.objects.create_user(
            email='organizer@example.com',
            name='Organizer Name',
            password='password123',
            role='organizer',
            status='active',
        )

        # Student user (ticket owner)
        self.student = User.objects.create_user(
            email='student@example.com',
            name='Student Name',
            password='password123',
            role='student',
            status='active',
        )

        # Create Event organized by organizer
        now = timezone.now()
        self.event = Event.objects.create(
            title="Test Event",
            description="This is a test event",
            date=now.date(),
            start_time=now.time(),
            end_time=(now + datetime.timedelta(hours=2)).time(),
            location="Test Location",
            status="approved",
            organizer=self.organizer
        )

        # Create Ticket for student
        self.ticket = Ticket.objects.create(
            event=self.event,
            user=self.student,
            qr_code="VALID_QR_12345",
            status="active",
        )

        # API client authenticated as organizer
        self.client = APIClient()
        self.client.force_authenticate(user=self.organizer)

    def post_checkin(self, qr_code):
        return self.client.post(
            '/api/tickets/checkin/',
            {'qr_code': qr_code},
            format='json'
        )

    def test_checkin_ticket_success(self):
        response = self.post_checkin(self.ticket.qr_code)
        print(f"Success response: {response.status_code} {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, "used")
        self.assertIsNotNone(self.ticket.used_at)

    def test_checkin_ticket_already_used(self):
        # Mark ticket as already used
        self.ticket.status = "used"
        self.ticket.used_at = timezone.now()
        self.ticket.save()

        response = self.post_checkin(self.ticket.qr_code)
        print(f"Already used response: {response.status_code} {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("already been used", response.data['message'])

    def test_checkin_ticket_invalid_qr(self):
        response = self.post_checkin("INVALID_QR")
        print(f"Invalid QR response: {response.status_code} {response.data}")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Invalid QR code", response.data['error'])

    def test_checkin_unauthorized_user(self):
        self.client.force_authenticate(user=None)
        response = self.post_checkin(self.ticket.qr_code)
        print(f"Unauthorized response: {response.status_code} {response.data}")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
