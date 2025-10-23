"""Views: These handle HTTP requests (GET, POST, PUT, DELETE).
Each class corresponds to an API endpoint that does something (like register, login, or manage events).
"""

from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Event
from .serializers import UserSerializer, EventSerializer
from .permissions import IsAdmin, IsStudentOrAdmin


# ---------- USER AUTH ----------

class CreateUserView(generics.CreateAPIView):
    """Registers new users."""
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return User.objects.all()


class LoginUserView(APIView):
    """Handles JWT login."""
    permission_classes = [AllowAny]

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
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


# ---------- EVENTS ----------

class EventListCreateView(generics.ListCreateAPIView):
    """List all events or create a new one (Admin only for POST)."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [IsStudentOrAdmin()]


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific event."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdmin()]
        return [IsStudentOrAdmin()]
