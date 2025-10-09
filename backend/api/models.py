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