"""
models.py
---------
Purpose:
Define the structure of your database tables for the project.

- Each class represents a table in the MySQL database.
- Each attribute (field) in the class represents a column in that table.
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth import get_user_model

# ============================================================
# CUSTOM USER MODEL AND MANAGER
# ============================================================

class CustomUserManager(BaseUserManager):
    """
    Custom manager to handle user creation and superuser creation.
    Ensures proper handling of email as the unique identifier.
    """

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        if not email:
            raise ValueError('The email field must be filled out.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hash the password before saving
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser (admin) with all permissions."""
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('status', 'active')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(email, password, **extra_fields)

# Custom User model with roles
class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with Role-Based Access Control (RBAC) support.

    Roles:
    - student: Can view and claim tickets.
    - organizer: Can create/manage events (requires admin approval).
    - admin: Can approve organizers and manage all users.
    """

    ROLE_CHOICES = [
        ('student', 'Student'),
        ('organizer', 'Organizer'),
        ('admin', 'Admin'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending', 'Pending'),
        ('suspended', 'Suspended'),
    ]

    # Core fields
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)

    # RBAC-related fields
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Custom manager
    objects = CustomUserManager()

    # Username field configuration
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def save(self, *args, **kwargs):
        """
        Automatically handle activation logic based on user role and status.
        - Organizers with suspended approval are deactivated.
        - Active users remain active.
        """
        if self.role == 'organizer' and self.status == 'suspended':
            self.is_active = False
        elif self.status == 'active':
            self.is_active = True
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        """Return a readable string representation of the user."""
        return f"{self.name} ({self.role})"
    
    class Meta:
        db_table = 'users' # Explicit table name in MySQL

# ============================================================
# EVENT MODEL
# ============================================================

# Ensure we use the custom User model
User = get_user_model()

# Event model
class Event(models.Model):
    """
    Event model to represent university or organization events.
    Each event is associated with an organizer (a User).
    """

    TICKET_CHOICES = (
        ('free', 'Free'),
        ('paid', 'Paid'),
    )

    # Event information
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField(default=0)
    ticket_type = models.CharField(max_length=10, choices=TICKET_CHOICES, default='free')
    category = models.CharField(max_length=100, blank=True)  # Filterable
    organization = models.CharField(max_length=255, blank=True)  # Filterable

    # Relationships
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')

    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    is_discovered = models.BooleanField(default=False)  # Whether visible on discovery page

    def __str__(self):
        """Readable representation of the event."""
        return self.title

# ============================================================
# TICKET MODEL
# ============================================================

class Ticket(models.Model):
    """
    Ticket model to track event ticket claims by students.
    - Each user can claim only one ticket per event.
    """

    event = models.ForeignKey('Event', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    claimed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')  # Prevent multiple claims by same user

    def __str__(self):
        """Readable representation of a ticket claim."""
        return f"{self.user.username} - {self.event.title}"