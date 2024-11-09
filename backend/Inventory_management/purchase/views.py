from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import PurchaseMasterSerializer

@api_view(['POST'])
def create_purchase(request):
    serializer = PurchaseMasterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Purchase entry created successfully"}, status=status.HTTP_201_CREATED)

    # Return error messages if data is invalid
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
