# item_master/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from .models import BrandMaster
from .serializers import *


# Item master views post api get api delete and update


@api_view(['POST'])
def create_item(request):
    """Create a new item."""
    print("Request Data:", request.data)  # Log request data to debug
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_items(request):
    """Retrieve all items where status is True (active)."""
    items = Item.objects.filter(status=True)  # Only active items
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_item(request, item_id):
    """Retrieve a specific item by its ID."""
    item = get_object_or_404(Item, id=item_id, status=True)
    serializer = ItemSerializer(item)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_item(request, item_id):
    """Update an existing item."""
    item = get_object_or_404(Item, id=item_id)
    serializer = ItemSerializer(item, data=request.data, partial=True)  # partial allows updating some fields
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def delete_item(request, item_id):
    """Soft delete an item by setting its status to False."""
    item = get_object_or_404(Item, id=item_id)
    
    # Mark the item as deleted (soft delete)
    item.status = False
    item.save()

    return Response({"message": "Item marked as deleted."}, status=status.HTTP_204_NO_CONTENT)













# Brand master views add api 
@api_view(['POST'])
def create_brand(request):
    brand_name = request.data.get('brand_name')
    
    if BrandMaster.objects.filter(brand_name=brand_name).exists():
        return Response(
            {"error": "Brand with this name already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

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
