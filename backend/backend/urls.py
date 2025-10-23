""" URLs: Connects paths (like /api/register/) to views.
 - When a request hits a URL, Django checks which view to run.
"""

from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, LoginUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),  # Django admin dashboard
    path("api/user/signup/", CreateUserView.as_view(), name="signup"),  # Signup route
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),  # JWT token route
    path("login/", LoginUserView.as_view(), name="login"),  # Login route (custom JWT login)
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),  # Refresh JWT token
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),  # Include API app routes
]
