from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # Specify the model to be serialized
        fields = ["id", "username", "password"] # Fields to be included in the user representation
        extra_kwargs = {"password": {"write_only": True}} # Make the password 
    
    # Method to create a user with data input
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data) # Create a new user instance usiign the validated data
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}