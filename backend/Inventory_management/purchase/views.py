from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from .serializers import SaleMasterSerializer
from .serializers import PurchaseMasterSerializer,PurchaseMasterSerializer1,PurchaseMasterSerializer2
from .models import PurchaseMaster,PurchaseDetails,SaleDetails,SaleMaster

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