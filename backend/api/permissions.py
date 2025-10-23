from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """Only admins can access."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsStudentOrAdmin(permissions.BasePermission):
    """Students and admins can access."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'student']
