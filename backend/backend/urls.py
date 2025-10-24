"""
urls.py
---------
Purpose: Define how HTTP paths (like /api/register/ or /admin/)
are mapped to specific Django views.

When a request hits a URL, Django checks this list (urlpatterns)
to determine which view should handle it.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Admin dashboard route (default Django admin panel)
    path("admin/", admin.site.urls),

    # Main API routes (delegates URL handling to 'api/urls.py')
    path("api/", include("api.urls")),

    # Django REST Framework’s built-in login/logout views (useful for the browsable API)
    path("api-auth/", include("rest_framework.urls")),

    # Optional: JWT authentication endpoints (for login/refreshing tokens)
    # Uncomment if you want to enable JWT endpoints globally:
    # path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]