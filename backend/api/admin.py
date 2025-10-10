""" ADMIN.PY
- Purpose: Make your models manageable through Django’s built-in admin site
- When you go to /admin, you can view and edit database records visually"""

from django.contrib import admin

# Register your models here.

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'organizer')
    search_fields = ('title', 'location', 'organizer__username')
    list_filter = ('date', 'location')

class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'registered_at')
    search_fields = ('user__username', 'event__title')
    list_filter = ('registered_at',)

