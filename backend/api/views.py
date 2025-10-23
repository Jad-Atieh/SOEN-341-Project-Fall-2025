"""Views: These handle HTTP requests (GET, POST, PUT, DELETE).
- Each class corresponds to an API endpoint that does something (like register a user)."""

from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
User = get_user_model()

# class NoteListCreate(generics.ListCreateAPIView):
#     serializer_class = NoteSerializer - checks if data is valid
#     permission_classes = [IsAuthenticated] - only users with a token can access this view

    #gets notes from a specific user
#     def get_queryset(self):
#         user = self.request.user 
#         return Note.objects.filter(author=user)
    
#     def perform_create(self, serializer): - overriding the default method 
#         if serializer.is_valid(): - if data is valid based on serializer rules, then save it
#             serializer.save(author=self.request.user)
#         else:
#             print(serializer.errors)

# class NoteDelete(generics.DestroyAPIView):
#     serializer_class = NoteSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # Specify the queryset for user objects
    serializer_class = UserSerializer # What kidve of serializer to use (data accepted to make a new user)
    permission_classes = [AllowAny] # Allow any user (authenticated or not) to access this view


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

from .models import Task
from .serializers import TaskSerializer
from rest_framework import viewsets

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

from rest_framework import generics, permissions, viewsets
from .models import Task, Profile
from .serializers import UserSerializer, TaskSerializer, ProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


# Register new users
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# Profile view (GET and PUT)
class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


# Task management
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(assigned_to=self.request.user)


from rest_framework import generics
from .models import Event
from .serializers import EventSerializer

class EventListView(generics.ListAPIView):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')

        if search:
            queryset = queryset.filter(title__icontains=search)
        return queryset

