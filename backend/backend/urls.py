"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls), # This creates the route "/admin/" which opens Django's built-in admin dashboard
    path("api/user/register/", CreateUserView.as_view(), name="register"), # When someone sends a request to "/api/user/register/", this will call the CreateUserView
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"), # This route "/api/token/" allows users to log in and receive a JWT token (access + refresh)
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"), # This route "/api/token/refresh/" lets a user refresh their JWT token if it expires
    path("api-auth/", include("rest_framework.urls")), 
    path("api/", include("api.urls")), 
]