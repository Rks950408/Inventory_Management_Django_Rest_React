# item_master/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from .models import BrandMaster
from .serializers import *

@api_view(['POST'])
def create_item(request):
    """Create a new item."""
    print("Request Data:", request.data)  
    
    item_name = request.data.get('item_name', '').strip().lower()  
    if Item.objects.filter(item_name__iexact=item_name).exists():
        return Response(
            {"detail": "Item with this name already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(status=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_items(request):
    """Retrieve all items where status is True (active), with optional search and pagination."""
    
    search_query = request.query_params.get('search', '')
    items = Item.objects.filter(status=True)  
    
    if search_query:
        items = items.filter(item_name__icontains=search_query) 

    # Pagination (optional)
    page = request.query_params.get('page', 1)
    items_per_page = 10  
    start_index = (int(page) - 1) * items_per_page
    end_index = start_index + items_per_page
    items = items[start_index:end_index]
    
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
    serializer = ItemSerializer(item, data=request.data, partial=True)  
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
    serializer = BrandMasterSerializer(brands, many=True)  
    return Response(serializer.data)  
