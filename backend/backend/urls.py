"""
urls.py
---------
Purpose:
Defines how HTTP paths (like /api/register/ or /admin/) are mapped to Django views.

When a request hits a URL, Django checks this list (urlpatterns)
to determine which view should handle it.
"""

from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, LoginUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Django Admin dashboard
    path("admin/", admin.site.urls),

    # User authentication routes
    path("api/user/signup/", CreateUserView.as_view(), name="signup"),
    path("login/", LoginUserView.as_view(), name="login"),

    # JWT token endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # REST framework's browsable API login/logout
    path("api-auth/", include("rest_framework.urls")),

    # API routes
    path("api/", include("api.urls")),
]
