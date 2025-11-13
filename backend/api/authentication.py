"""
authentication.py
---------
Purpose:
Create a custom authentication class that extends JWTAuthentication and enforces user status.


"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions

class ActiveUserJWTAuthentication(JWTAuthentication):
    """
    Reject users who are not active (pending/suspended)
    even if they provide a valid JWT token.
    """
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        if user.status != "active":
            raise exceptions.AuthenticationFailed(
                "Account not active. Please wait for admin approval.",
                code="user_inactive"
            )
        return user
