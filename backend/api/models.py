""" Purpose: Define the structure of your database tables.
- Each class here represents a table in your MySQL database.
- Each attribute (field) in the class represents a column in that table."""



from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
import qrcode
from io import BytesIO
from django.core.files import File
from django.db import models
import os

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The email field must be filled out.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)



class User(AbstractUser):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("teacher", "Teacher"),
        ("admin", "Admin"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="student",
        help_text="Defines the user's role in the system.",
    )

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"


class Profile(models.Model):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("teacher", "Teacher"),
        ("admin", "Admin"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=100)
    category = models.CharField(max_length=50, blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Save first to get event ID
        qr_data = f"Event ID: {self.id} | Title: {self.title} | Date: {self.date} | Location: {self.location}"
        qr = qrcode.make(qr_data)
        buffer = BytesIO()
        qr.save(buffer, format='PNG')
        file_name = f"event_{self.id}_qr.png"
        qr_path = os.path.join('qr_codes', file_name)
        self.qr_code.save(qr_path, File(buffer), save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    