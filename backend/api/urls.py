from django.urls import path
from . import views
from .views import EventListCreateView, EventDetailView
from .views import TicketListCreateView, TicketDetailView

urlpatterns = [
    #path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    #path("notes/delete/<int:pk>/", views.CreateUserView.as_view(), name="delete-note"),
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
]