""" URLs: Connects paths (like /api/register/) to views.
 - When a request hits a URL, Django checks which view to run."""

from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from api.views import LoginUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls), # This creates the route "/admin/" which opens Django's built-in admin dashboard
    path("api/user/signup/", CreateUserView.as_view(), name="signup"), # When someone sends this request: "/api/user/register/", it will be handled by the fucntion CreateUserView
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"), # This route "/api/token/" allows users to log in and receive a JWT token (access + refresh)
    path("login/", LoginUserView.as_view(), name="login"), # This route "/api/login/" allows users to log in and receive a JWT token (access + refresh)
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"), # This route "/api/token/refresh/" lets a user refresh their JWT token if it expires
    path("api-auth/", include("rest_framework.urls")), 
    path("api/", include("api.urls")), #includes urls from the api app
]