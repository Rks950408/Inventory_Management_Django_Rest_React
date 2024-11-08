# item_master/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError

from .models import BrandMaster
from .serializers import *
@api_view(['POST'])
def create_brand(request):
    brand_name = request.data.get('brand_name')
    
    # Check if a brand with the same name already exists
    if BrandMaster.objects.filter(brand_name=brand_name).exists():
        return Response(
            {"error": "Brand with this name already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Try to save the new brand and handle IntegrityError if it occurs
    serializer = BrandMasterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response(
                {"error": "Brand with this name already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_brand(request):
    brands = BrandMaster.objects.all()
    
    serializer = BrandMasterSerializer(brands, many=True)  # Use the BrandMaster serializer
    
    return Response(serializer.data)
