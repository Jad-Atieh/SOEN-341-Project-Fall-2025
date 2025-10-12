"""Views: These handle HTTP requests (GET, POST, PUT, DELETE).
- Each class corresponds to an API endpoint that does something (like register a user)."""

from django.shortcuts import render
#from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse
from django.template import loader


# class NoteListCreate(generics.ListCreateAPIView):
#     serializer_class = NoteSerializer - checks if data is valid
#     permission_classes = [IsAuthenticated] - only users with a token can access this view

    #gets notes from a specific user
#     def get_queryset(self):
#         user = self.request.user 
#         return Note.objects.filter(author=user)
    
User = get_user_model()

class CreateUserView(generics.CreateAPIView):
#    queryset = User.objects.all() # Specify the queryset for user objects
    serializer_class = UserSerializer # What kidve of serializer to use (data accepted to make a new user)
    permission_classes = [AllowAny] # Allow any user (authenticated or not) to access this view

    def get_queryset(self):
        return User.objects.all()
    

def load(request):
    template = loader.get_template("events_list.html")
    return HttpResponse(template.render())

def members(request):
    #template = loader.get_template("events_list.html")
    return HttpResponse("god help")