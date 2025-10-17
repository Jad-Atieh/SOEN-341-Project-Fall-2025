"""Views: These handle HTTP requests (GET, POST, PUT, DELETE).
- Each class corresponds to an API endpoint that does something (like register a user)."""

from django.shortcuts import render
from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event
from .serializers import UserSerializer
from .serializers import EventSerializer

# class NoteListCreate(generics.ListCreateAPIView):
#      serializer_class = NoteSerializer # checks if data is valid
#      permission_classes = [IsAuthenticated] # only users with a token can access this view
#
     #gets notes from a specific user
#      def get_queryset(self):
#          user = self.request.user
#          return Note.objects.filter(author=user)
    
User = get_user_model()

class CreateUserView(generics.CreateAPIView):
#    queryset = User.objects.all() # Specify the queryset for user objects
    serializer_class = UserSerializer # What kind of serializer to use (data accepted to make a new user)
    permission_classes = [AllowAny] # Allow any user (authenticated or not) to access this view

    def get_queryset(self):
        return User.objects.all()

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all() # Specify the queryset for event objects
    serializer_class = EventSerializer # What kind of serializer to use (data accepted to make a new event)
    permission_classes = [AllowAny]  # adjust later based on RBAC

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all() # Specify the queryset for event objects
    serializer_class = EventSerializer # What kind of serializer to use (data accepted to make a new event)
    permission_classes = [AllowAny] # Allow any user (authenticated or not) to access this view