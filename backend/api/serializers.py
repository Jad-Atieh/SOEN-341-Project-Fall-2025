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
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        """Create a new user with role-based logic."""
        role = validated_data.get('role', 'student')

        # Organizer accounts start as 'pending', students as 'active'
        status = 'pending' if role == 'organizer' else 'active'

        #print(validated_data)

        # Create user using the CustomUserManager logic
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role,
            status=status,
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
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organizer', 'created_at']

# -------------------------------
# TICKET SERIALIZER
# -------------------------------
class TicketSerializer(serializers.ModelSerializer):
    """
    Converts Ticket model instances <-> JSON.
    - User field is read-only (taken from authenticated user).
    """

    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['user', 'claimed_at']

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