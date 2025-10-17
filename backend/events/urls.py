from django.urls import path, include
from .views import EventListView

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),
]
