# item_master/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import BrandMaster
from .serializers import *

@api_view(['POST'])
def create_brand(request):
    if request.method == 'POST':
        serializer = BrandMasterSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_brand(request):
    brands = BrandMaster.objects.all()
    
    serializer = BrandMasterSerializer(brands, many=True)  # Use the BrandMaster serializer
    
    return Response(serializer.data)
