"""Serializer: Converts Django model instances <-> JSON data.
 - Takes JSON from frontend and converts it to Python objects (for saving in DB)
 - Takes Python objects from backend and converts to JSON (for sending to frontend)"""

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # Specify the model to be serialized
        fields = ["id", "email", "name", "password", "role", "status"] # Fields to be included in the user representation
        extra_kwargs = {"password": {"write_only": True}} # Make the password 
    
    # Method to create a user with data input
    def create(self, validated_data):
        #print(validated_data)
        #user = User.objects.create_user(**validated_data) # Create a new user instance usiign the validated data
        
        # from our CustomUserManager
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'student')  # default to student
        )

        return user

#sample serializer for notes - creates a note with specific fields and makes author read only
# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content", "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}