""" ADMIN.PY
- Purpose: Make your models manageable through Django’s built-in admin site
- When you go to /admin, you can view and edit database records visually"""

from django.contrib import admin

# Register your models here.
# backend/api/admin.py
from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'category', 'date', 'created_at')
    list_filter = ('category', 'location', 'date')
    search_fields = ('title', 'description')
