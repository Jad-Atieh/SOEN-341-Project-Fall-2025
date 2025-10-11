"""Views: These handle HTTP requests (GET, POST, PUT, DELETE).
- Each class corresponds to an API endpoint that does something (like register a user)."""


from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response                      
from .serializers import UserSerializer

User = get_user_model

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
    

#Login API
class LoginUserView(APIView):
    permission_classes = [AllowAny]  # Allow any user (authenticated or not) to access this view

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid Credentials'}, status=400)
        
