"""
permissions.py
---------
Purpose:
Define custom permission classes to enforce Role-Based Access Control (RBAC)
for different user types — Admin, Organizer, and Student.

Each class below ensures that only users with specific roles can access
certain API endpoints.
"""

from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """Permission: Allows access only to Admin users."""

    def has_permission(self, request, view):
        # Check if user is logged in and has role 'admin'
        return request.user.is_authenticated and request.user.role == 'admin'


class IsOrganizer(permissions.BasePermission):
    """Permission: Allows access only to Organizer users."""

    def has_permission(self, request, view):
        # Check if user is logged in and has role 'organizer'
        return request.user.is_authenticated and request.user.role == 'organizer'


class IsStudent(permissions.BasePermission):
    """Permission: Allows access only to Student users."""

    def has_permission(self, request, view):
        # Check if user is logged in and has role 'student'
        return request.user.is_authenticated and request.user.role == 'student'


class IsStudentOrOrganizerOrAdmin(permissions.BasePermission):
    """Permission: Allows access to Students, Organizers, and Admins."""

    def has_permission(self, request, view):
        # Check if user is logged in and role is in allowed list
        return (
                request.user.is_authenticated
                and request.user.role in ['student', 'organizer', 'admin']
        )
    
class IsOrganizerOrAdmin(permissions.BasePermission):
    """
    Permission: Allows access to Admins or Organizers.
    Organizers can only access their own objects (enforced in the view).
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'organizer']

    # Optional object-level check if you want to enforce per-object rules
    def has_object_permission(self, request, view, obj):
        # Admin can access anything; organizers only their own events
        return request.user.role == 'admin' or (request.user.role == 'organizer' and obj.organizer == request.user)
