""" ADMIN.PY
- Purpose: Make your models manageable through Django’s built-in admin site
- When you go to /admin, you can view and edit database records visually"""

from django.contrib import admin
from .models import Event

admin.site.register(Event)