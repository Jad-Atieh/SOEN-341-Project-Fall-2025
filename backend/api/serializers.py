"""Serializer: Converts Django model instances <-> JSON data.
 - Takes JSON from frontend and converts it to Python objects (for saving in DB)
 - Takes Python objects from backend and converts to JSON (for sending to frontend)"""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Event
from .models import Ticket

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # Specify the model to be serialized
        fields = ["id", "email", "name", "password", "role", "status"] # Fields to be included in the user representation
        extra_kwargs = {"password": {"write_only": True}} # Make the password 
    
    # Method to create a user with data input
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data) # Create a new user instance using the validated data
        
        # from our CustomUserManager
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'student')  # default to student
        )

        return user

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event # Specify the model to be serialized
        fields = '__all__' # Fields to be included in the user representation

class TicketSerializer(serializers.ModelSerializer):
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
        read_only_fields = ('claimed_at', 'used_at', 'qr_code')
    

#sample serializer for notes - creates a note with specific fields and makes author read only
# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = None
#         fields = ["id", "title", "content", "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}