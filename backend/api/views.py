from django.shortcuts import render
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # Specify the queryset for user objects
    serializer_class = UserSerializer # Specify the serializer class to be used
    permission_classes = [AllowAny] # Allow any user (authenticated or not) to access this view