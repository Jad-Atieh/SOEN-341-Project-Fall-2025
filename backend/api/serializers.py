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
from .models import User, Event, Ticket, EventFeedback
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.shortcuts import get_object_or_404

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
    average_rating = serializers.FloatField(read_only=True) # average rating of the event
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organizer', 'created_at', "approved_by", "approved_at", "average_rating"]

    def get_average_rating(self, obj):
        return obj.average_rating()

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
    
    def validate(self, data):
        """
        Validate ticket creation - check capacity and duplicates
        """
        # Only run validation during creation (not updates)
        if self.instance is None:
            event = data.get('event')
            user = data.get('user')
            
            # Check if event exists and has capacity
            if event and hasattr(event, 'capacity'):
                if event.capacity <= 0:
                    raise serializers.ValidationError({
                        "error": "This event is at full capacity"
                    })
            
            # Check for duplicate tickets
            if event and user:
                if Ticket.objects.filter(event=event, user=user).exists():
                    raise serializers.ValidationError({
                        "error": "You already have a ticket for this event"
                    })
        
        return data
    
    def create(self, validated_data):
        """
        Create ticket with additional validation
        """
        event = validated_data.get('event')
        user = validated_data.get('user')
        
        # Final capacity check (in case of race conditions)
        if event.capacity <= 0:
            raise serializers.ValidationError({
                "error": "Event is at full capacity"
            })
        
        # Create the ticket - capacity will be decreased in model's save() method
        return super().create(validated_data)

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


# ---------------------------------------------------
# TOKEN SERIALIZER WITH EXTRA CLAIMS (role and name)
# ---------------------------------------------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add extra claims
        token['role'] = user.role
        token['name'] = user.name

        return token


# -------------------------------
# EVENT FEEDBACK SERIALIZER
# -------------------------------
class EventFeedbackSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = EventFeedback
        fields = ["id", "event", "user", "user_name", "ticket", "event_title", "rating", "comment", "created_at"]
        read_only_fields = ["event", "user", "created_at"]  # Add event to read_only

    def validate(self, data):
        """
        Validate that user can provide feedback for this event
        """
        request = self.context.get('request')
        # Get event from context instead of data since it's read-only
        event_id = self.context.get('view').kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id)

        if request and request.method == 'POST':
            # Check if user has a used ticket for this event
            if not Ticket.objects.filter(
                event=event, 
                user=request.user, 
                status='used'
            ).exists():
                raise serializers.ValidationError(
                    "You can only provide feedback for events you have attended."
                )

            # Check for duplicate feedback
            if EventFeedback.objects.filter(event=event, user=request.user).exists():
                raise serializers.ValidationError(
                    "You have already provided feedback for this event."
                )

        return data

    def create(self, validated_data):
        """
        Automatically set the user and event from the context
        """
        request = self.context.get('request')
        view = self.context.get('view')
        event_id = view.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id)
        
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
            validated_data['event'] = event
            
            # Try to find the user's used ticket for this event
            try:
                ticket = Ticket.objects.get(
                    event=event, 
                    user=request.user, 
                    status='used'
                )
                validated_data['ticket'] = ticket
            except Ticket.DoesNotExist:
                # Ticket is optional
                pass
        
        return super().create(validated_data)