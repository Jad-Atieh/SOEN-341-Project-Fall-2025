from django.urls import path
from . import views
from .views import EventListView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
#     path("notes/", views.NoteListCreate.as_view(), name="note-list"),
#     path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
]
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, TaskViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('user/register/', RegisterView.as_view(), name='register'),
    path('user/profile/', ProfileView.as_view(), name='profile'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('events/', EventListView.as_view(), name='event-list'),
]
urlpatterns += router.urls


