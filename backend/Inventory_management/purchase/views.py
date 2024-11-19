from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from .serializers import SaleMasterSerializer,SaleMasterSerializer1,SaleDetailsSerializer2
from .serializers import PurchaseMasterSerializer,PurchaseMasterSerializer1,PurchaseMasterSerializer2,PurchaseDetailsSerializer2
from .models import PurchaseMaster,PurchaseDetails,SaleDetails,SaleMaster,Item
from django.db.models import Sum
from django.db import connection
from django.utils import timezone
from django.db.models import Q  # For filtering


@api_view(['POST'])
def create_purchase(request):
    serializer = PurchaseMasterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Purchase entry created successfully"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_purchase_master(request):
    try:
        purchases = PurchaseMaster.objects.all()

        serializer = PurchaseMasterSerializer1(purchases, many=True)

        # Return the serialized data as a JSON response
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_purchase_details_by_master_id(request, purchase_master_id):
    try:
        purchase_master = PurchaseMaster.objects.get(id=purchase_master_id)
        
        serializer = PurchaseMasterSerializer2(purchase_master)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except PurchaseMaster.DoesNotExist:
        return Response({"error": "PurchaseMaster not found for the given ID"}, status=status.HTTP_404_NOT_FOUND)
    
# sales for all api:--------------------------------
    
@api_view(['GET'])
def get_total_quantity_for_item(request, item_id):
    try:
        total_quantity = PurchaseDetails.objects.filter(item_id=item_id).aggregate(Sum('quantity'))['quantity__sum'] or 0
        
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

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_sale_master(request):
    try:
        sales = SaleMaster.objects.all()

        serializer = SaleMasterSerializer1(sales, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_sale_details_by_master_id(request, sale_master_id):
    try:
        sale_master = SaleMaster.objects.get(id=sale_master_id)
        
        serializer = SaleMasterSerializer1(sale_master)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except SaleMaster.DoesNotExist:
        return Response({"error": "SaleMaster not found for the given ID"}, status=status.HTTP_404_NOT_FOUND)
    


# details stock
@api_view(['GET'])
def stock_list(request):
    item_id = request.GET.get('item', None)
    search_query = request.GET.get('search', '').strip()

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

    conditions = []
    if item_id:
        conditions.append(f"item.id = {item_id}")
    if search_query:
        conditions.append(f"item.item_name ILIKE '%{search_query}%'")

    if conditions:
        base_query += ' WHERE ' + ' AND '.join(conditions)

    with connection.cursor() as cursor:
        cursor.execute(base_query)
        stock_data = cursor.fetchall()

    return Response({'stock_data': stock_data})

# details stock by date range
@api_view(['GET'])
def details_sale_purchase(request):
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    selected_item = request.GET.get('item', 'all')
    selected_type = request.GET.get('type', 'purchase')

    items = None
    if from_date and to_date:
        from_date = timezone.datetime.strptime(from_date, '%Y-%m-%d')
        to_date = timezone.datetime.strptime(to_date, '%Y-%m-%d')

        if selected_type == 'purchase':
            items = PurchaseDetails.objects.filter(datetime__range=(from_date, to_date))
            if selected_item != 'all':
                items = items.filter(item__item_name=selected_item)
            serializer = PurchaseDetailsSerializer2(items, many=True)
        else:  # selected_type == 'sale'
            items = SaleDetails.objects.filter(datetime__range=(from_date, to_date))
            if selected_item != 'all':
                items = items.filter(item__item_name=selected_item)
            serializer = SaleDetailsSerializer2(items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response({"error": "Invalid date range."}, status=status.HTTP_400_BAD_REQUEST)
