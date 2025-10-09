"""Purpose: Define application configuration.
- Django uses this to recognize your app inside the overall project.
- Usually, you don’t modify this much — just keep the default structure."""

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
