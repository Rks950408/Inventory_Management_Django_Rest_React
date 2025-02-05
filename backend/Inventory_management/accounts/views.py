from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login, User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

@api_view(['POST'])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)  # Generate token for new user
        return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        update_last_login(None, user)
        return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    # Check if the request has an auth token
    if request.auth:
        request.auth.delete()  # Delete the token, logging out the user
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "No active session found."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_detail(request):
    return Response({"user": UserSerializer(request.user).data})
