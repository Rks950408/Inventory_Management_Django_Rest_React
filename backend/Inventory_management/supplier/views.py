# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Supplier
from .serializers import SupplierSerializer

@api_view(['GET'])
def get_suppliers(request):
    suppliers = Supplier.objects.all()
    serializer = SupplierSerializer(suppliers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_supplier(request):
    name = request.data.get("name", "").upper()
    contact = request.data.get("contact", "").upper()
    address = request.data.get("address", "").upper()

    if Supplier.objects.filter(name=name).exists():
        return Response(
            {"error": "A supplier with this name already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if Supplier.objects.filter(contact=contact).exists():
        return Response(
            {"error": "A supplier with this contact number already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create a new supplier with all fields in uppercase
    data = {
        "name": name,
        "contact": contact,
        "address": address,
        "status": request.data.get("status", True),
        "entry_date": request.data.get("entry_date"),
    }

    serializer = SupplierSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)