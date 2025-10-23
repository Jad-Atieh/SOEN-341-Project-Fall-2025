"""
Views: These handle HTTP requests (GET, POST, PUT, DELETE).
- Each class corresponds to an API endpoint that does something (like register a user).
"""

from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

User = get_user_model()


# Create User (Signup)
class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer  # What kind of serializer to use (data accepted to make a new user)
    permission_classes = [AllowAny]    # Allow any user (authenticated or not) to access this view

    def get_queryset(self):
        return User.objects.all()


# Login User (JWT Authentication)
class LoginUserView(APIView):
    permission_classes = [AllowAny]  # Allow any user (authenticated or not) to access this view

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'role': user.role,
                    'status': user.status
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
