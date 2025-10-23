from django.urls import path
from . import views
from .views import EventListCreateView, EventDetailView

urlpatterns = [
    #path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    #path("notes/delete/<int:pk>/", views.CreateUserView.as_view(), name="delete-note"),
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
]