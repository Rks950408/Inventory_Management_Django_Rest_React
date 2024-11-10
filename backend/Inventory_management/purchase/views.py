from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from .serializers import SaleMasterSerializer,SaleMasterSerializer1
from .serializers import PurchaseMasterSerializer,PurchaseMasterSerializer1,PurchaseMasterSerializer2
from .models import PurchaseMaster,PurchaseDetails,SaleDetails,SaleMaster,Item
from django.db.models import Sum
from django.db import connection


@api_view(['POST'])
def create_purchase(request):
    serializer = PurchaseMasterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Purchase entry created successfully"}, status=status.HTTP_201_CREATED)

    # Return error messages if data is invalid
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_purchase_master(request):
    try:
        # Fetch all PurchaseMaster entries
        purchases = PurchaseMaster.objects.all()

        # Serialize the data
        serializer = PurchaseMasterSerializer1(purchases, many=True)

        # Return the serialized data as a JSON response
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_purchase_details_by_master_id(request, purchase_master_id):
    try:
        # Retrieve the PurchaseMaster record
        purchase_master = PurchaseMaster.objects.get(id=purchase_master_id)
        
        # Serialize the PurchaseMaster with its related PurchaseDetails
        serializer = PurchaseMasterSerializer2(purchase_master)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except PurchaseMaster.DoesNotExist:
        return Response({"error": "PurchaseMaster not found for the given ID"}, status=status.HTTP_404_NOT_FOUND)
    
# sales for all api:--------------------------------
    
@api_view(['GET'])
def get_total_quantity_for_item(request, item_id):
    try:
        # Calculate the total quantity purchased for the specified item
        total_quantity = PurchaseDetails.objects.filter(item_id=item_id).aggregate(Sum('quantity'))['quantity__sum'] or 0
        
        # Calculate the total quantity sold for the specified item
        sold_quantity = SaleDetails.objects.filter(item_id=item_id).aggregate(Sum('quantity'))['quantity__sum'] or 0
        
        # Calculate the available quantity
        available_quantity = total_quantity - sold_quantity
        
        # Return the total quantity, sold quantity, and available quantity
        return Response({
            'item_id': item_id,
            'total_quantity': total_quantity,
            'sold_quantity': sold_quantity,
            'available_quantity': available_quantity
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# sale api 
@api_view(['POST'])
def create_sale(request):
    serializer = SaleMasterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Sale entry created successfully"}, status=status.HTTP_201_CREATED)

    # Return error messages if data is invalid
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_sale_master(request):
    try:
        # Fetch all SaleMaster entries and prefetch related SaleDetails
        sales = SaleMaster.objects.all()

        # Serialize the data using SaleMasterSerializer1
        serializer = SaleMasterSerializer1(sales, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_sale_details_by_master_id(request, sale_master_id):
    try:
        # Retrieve the SaleMaster record
        sale_master = SaleMaster.objects.get(id=sale_master_id)
        
        # Serialize the SaleMaster with its related SaleDetails and Supplier details
        serializer = SaleMasterSerializer1(sale_master)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except SaleMaster.DoesNotExist:
        return Response({"error": "SaleMaster not found for the given ID"}, status=status.HTTP_404_NOT_FOUND)
    


# details stock
@api_view(['GET'])
def stock_list(request):
    # Retrieve filter parameters from the request
    item_id = request.GET.get('item', None)
    search_query = request.GET.get('search', '').strip()

    # Define the base query
    base_query = '''
        WITH purchase_data AS (
            SELECT item_id, SUM(quantity) AS total_purchase_price
            FROM public.purchase_details
            GROUP BY item_id
        ),
        sale_data AS (
            SELECT item_id, SUM(quantity) AS total_sale_price
            FROM public.sale_details
            GROUP BY item_id
        )
        SELECT 
            item.id,
            item.item_name,
            COALESCE(sale_data.total_sale_price, 0) AS total_sale_price,
            COALESCE(purchase_data.total_purchase_price, 0) AS total_purchase_price,
            CAST(COALESCE(purchase_data.total_purchase_price, 0) - COALESCE(sale_data.total_sale_price, 0) AS INTEGER) AS available_quantity
        FROM 
            public.item_master item
        LEFT JOIN 
            purchase_data ON item.id = purchase_data.item_id
        LEFT JOIN 
            sale_data ON item.id = sale_data.item_id
    '''

    # Add conditions for item ID and search query if present
    conditions = []
    if item_id:
        conditions.append(f"item.id = {item_id}")
    if search_query:
        conditions.append(f"item.item_name ILIKE '%{search_query}%'")

    if conditions:
        base_query += ' WHERE ' + ' AND '.join(conditions)

    # Execute the query and fetch the results
    with connection.cursor() as cursor:
        cursor.execute(base_query)
        stock_data = cursor.fetchall()

    # Return the results as JSON
    return Response({'stock_data': stock_data})