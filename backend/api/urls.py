from django.urls import path, include
from . import views

urlpatterns = [
#     path("notes/", views.NoteListCreate.as_view(), name="note-list"),
#     path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("", views.load, name="eventlist")

]