from rest_framework import generics
from .models import Event
from .serializers import EventSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class EventListView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer  
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        organization = self.request.query_params.get('organization', None)
        date = self.request.query_params.get('date', None)

        if category:
            queryset = queryset.filter(category=category)
        if organization:
            queryset = queryset.filter(organization=organization)
        if date:
            queryset = queryset.filter(date=date)

        return queryset
