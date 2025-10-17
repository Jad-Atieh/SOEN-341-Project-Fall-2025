from django.db import models

class Event(models.Model):
    Category_Choices = [
        ('academic', 'Academic'),
        ('tech', 'Tech'),
        ('music', 'Music'),
        ('cultural', 'Cultural'),
        ('sports', 'Sports'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=Category_Choices)
    capacity = models.IntegerField()
    #organization = models.CharField(max_length=255)

