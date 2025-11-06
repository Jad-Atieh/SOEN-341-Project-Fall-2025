"""
serializers.py
---------Purpose:
Serializers convert Django model instances <-> JSON data.

They serve two main purposes:
1. Take JSON data from the frontend and convert it into Python objects for saving to the database.
2. Take Python objects from the backend and convert them into JSON for sending to the frontend.
"""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import User, Event, Ticket
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Get the custom User model
User = get_user_model()

# -------------------------------
# USER REGISTRATION SERIALIZER
# -------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles user registration.
    - Automatically sets role and status based on input.
    - Ensures passwords are write-only for security.
    """

    class Meta:
        model = User
        fields = ["id", "email", "name", "password", "role", "status"]
        extra_kwargs = {
            "password": {"write_only": True},
            "status": {"read_only": True},  # Status is not user-controlled
        }

    def create(self, validated_data):
        """
        Create a new user instance.
        All new accounts (students or organizers) start as:
        - status = 'pending'
        - is_active = False
        until approved by an admin.
        """
        role = validated_data.get('role', 'student')

        #print(validated_data)

        # Force all new users to start pending
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role,
            status='pending',   # Enforced default
        )
        user.save()
        return user

# -------------------------------
# EVENT SERIALIZER
# -------------------------------
class EventSerializer(serializers.ModelSerializer):
    """
    Converts Event model instances <-> JSON.
    Includes organizer info and marks certain fields as read-only.
    """

    organizer = serializers.StringRelatedField(read_only=True)  # Show organizer name instead of ID
    approved_by = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organizer', 'created_at', "approved_by", "approved_at"]

# -------------------------------
# TICKET SERIALIZER
# -------------------------------
class TicketSerializer(serializers.ModelSerializer):
    """
    Converts Ticket model instances <-> JSON.
    - User field is read-only (taken from authenticated user).
    """


    event_title = serializers.CharField(source='event.title', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    is_valid = serializers.ReadOnlyField()
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'event', 'event_title', 'user', 'user_name', 'user_email',
            'qr_code', 'status', 'claimed_at', 'used_at', 'is_valid'
        ]
        read_only_fields = ('user', 'claimed_at', 'used_at', 'qr_code')

# -------------------------------
# USER SERIALIZER (For Admin Use)
# -------------------------------
class UserSerializer(serializers.ModelSerializer):
    """
    Used by Admins to view or manage users.
    - Includes key user info.
    - is_active is read-only (controlled by role/status).
    """

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'status', 'is_active']
        read_only_fields = ['is_active']


# -------------------------------
# TOKEN SERIALIZER WITH EXTRA CLAIMS (role and name)
# -------------------------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add extra claims
        token['role'] = user.role
        token['name'] = user.name

        return token