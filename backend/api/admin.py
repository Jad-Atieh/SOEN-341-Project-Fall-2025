"""
admin.py
---------
Purpose:
    - Registers your models with Django's built-in admin interface.
    - Allows you to view, add, edit, and delete model data visually at /admin.
"""

from django.contrib import admin
from .models import Event, User, Ticket  # Import the models you want to manage in the admin panel

# Register models to make them appear in the Django admin dashboard
admin.site.register(User)   # Allows managing user accounts (students, organizers, admins)
admin.site.register(Event)  # Allows managing event records
admin.site.register(Ticket) # allows managing tickets