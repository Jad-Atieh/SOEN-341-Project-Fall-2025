""" Purpose: Define the structure of your database tables.
- Each class here represents a table in your MySQL database.
- Each attribute (field) in the class represents a column in that table."""


from django.db import models
from django.contrib.auth.models import User # Link data to specific users

#sample model for notes
# class Note(models.Model):
#     title = models.CharField(max_length=100) # CharField for short text
#     content = models.TextField() # TextField for long text
#     created_at = models.DateTimeField(auto_now_add=True) # DateTimeField to store date and time, auto set on creation
#     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes") #ForeignKey creates a relationship (many‑to‑one) between Note and User, when user deleted so is data, and can be accessed with user.notes.all()

#     def __str__(self):
#         return self.title
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
