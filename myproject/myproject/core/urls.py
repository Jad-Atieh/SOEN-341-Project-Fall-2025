from django.urls import path
from .views import login_view
from .views import signup_view

urlpatterns = [
    path('login/', login_view, name='login'),
]

urlpatterns = [
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
]