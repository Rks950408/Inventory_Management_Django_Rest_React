from rest_framework import serializers
from .models import PurchaseMaster, PurchaseDetails,SaleDetails,SaleMaster
from item_master.models import Item
from supplier.models import Supplier
from .supplier_serializers import SupplierSerializer  
class PurchaseDetailsSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(write_only=True)  

    class Meta:
        model = PurchaseDetails
        fields = ['item_name', 'brand_name', 'quantity', 'price', 'amount']

    def validate_item_name(self, value):
        try:
            item = Item.objects.get(item_name=value) 
            return item
        except Item.DoesNotExist:
            raise serializers.ValidationError(f"Item '{value}' not found.")

    def create(self, validated_data):
        item_instance = validated_data.pop('item_name')  
        purchase_detail = PurchaseDetails.objects.create(item=item_instance, **validated_data)
        return purchase_detail


class PurchaseMasterSerializer(serializers.ModelSerializer):
    supplier = serializers.CharField(write_only=True)  
    purchase_details = PurchaseDetailsSerializer(many=True)  

    class Meta:
        model = PurchaseMaster
        fields = ['invoice_no', 'invoice_date', 'supplier', 'total_amount', 'purchase_details']

    def validate_supplier(self, value):
        try:
            supplier = Supplier.objects.get(name=value)  
            return supplier
        except Supplier.DoesNotExist:
            raise serializers.ValidationError(f"Supplier '{value}' not found.")

    def create(self, validated_data):
        supplier_instance = validated_data.pop('supplier')
        purchase_details_data = validated_data.pop('purchase_details')

        purchase_master = PurchaseMaster.objects.create(
            supplier=supplier_instance,
            **validated_data
        )

        for detail_data in purchase_details_data:
            item = detail_data.pop('item_name') 
            PurchaseDetails.objects.create(
                purchase_master=purchase_master,
                item=item,
                **detail_data
            )

        return purchase_master


class PurchaseMasterSerializer1(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='get_supplier_name', read_only=True)

    class Meta:
        model = PurchaseMaster
        fields = ['id', 'invoice_no', 'invoice_date', 'total_amount', 'datetime', 'status', 'supplier_name']

class PurchaseDetailsSerializer2(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.item_name', read_only=True)  

    class Meta:
        model = PurchaseDetails
        fields = ['id', 'item_name', 'brand_name', 'quantity', 'price', 'amount', 'datetime', 'status']

class PurchaseMasterSerializer2(serializers.ModelSerializer):
    purchase_details = PurchaseDetailsSerializer2(source='purchasedetails_set', many=True)  
    supplier = SupplierSerializer()  
    class Meta:
        model = PurchaseMaster
        fields = ['id', 'invoice_no', 'invoice_date', 'supplier', 'total_amount', 'datetime', 'status', 'purchase_details']


# sale serializers
class SaleDetailsSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(write_only=True)  

    class Meta:
        model = SaleDetails
        fields = ['item_name', 'brand_name', 'quantity', 'price', 'amount', 'status']

    def validate_item_name(self, value):
        try:
            item = Item.objects.get(item_name=value)  
            return item
        except Item.DoesNotExist:
            raise serializers.ValidationError(f"Item '{value}' not found.")

    def create(self, validated_data):
        item_instance = validated_data.pop('item_name')   
        sale_detail = SaleDetails.objects.create(item=item_instance, **validated_data)
        return sale_detail

class SaleMasterSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(write_only=True)   
    sale_details = SaleDetailsSerializer(many=True)   

    class Meta:
        model = SaleMaster
        fields = ['invoice_no', 'invoice_date', 'customer', 'total_amount', 'sale_details', 'status']

    def validate_customer(self, value):
        try:
            customer = Supplier.objects.get(name=value)   
            return customer
        except Supplier.DoesNotExist:
            raise serializers.ValidationError(f"Customer '{value}' not found.")

    def create(self, validated_data):
        customer_instance = validated_data.pop('customer')
        sale_details_data = validated_data.pop('sale_details')

        sale_master = SaleMaster.objects.create(customer=customer_instance, **validated_data)

        for detail_data in sale_details_data:
            item = detail_data.pop('item_name')  
            SaleDetails.objects.create(
                sale_master=sale_master,
                item=item,
                **detail_data
            )

        return sale_master

class SaleDetailsSerializer1(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.item_name', read_only=True)

    class Meta:
        model = SaleDetails
        fields = ['item_name', 'brand_name', 'quantity', 'price', 'amount', 'status']


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier 
        fields = ['id', 'name', 'contact', 'address', 'status', 'entry_date']


class SaleMasterSerializer1(serializers.ModelSerializer):
    customer = SupplierSerializer(read_only=True)
    sale_details = SaleDetailsSerializer1(many=True)  

    class Meta:
        model = SaleMaster
        fields = ['id', 'invoice_no', 'invoice_date', 'total_amount', 'customer', 'sale_details']


# details for 
class PurchaseDetailsSerializer2(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.item_name')  
    total_price = serializers.SerializerMethodField()  
    supplier_name= serializers.CharField(source='purchase_master.supplier')  
    class Meta:
        model = PurchaseDetails
        fields = ['id', 'item_name', 'price', 'quantity', 'total_price', 'datetime', 'supplier_name']

    def get_total_price(self, obj):
        return obj.price * obj.quantity if obj.price and obj.quantity else 0  


class SaleDetailsSerializer2(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.item_name')  
    total_amount = serializers.FloatField(source='amount')  
    customer_name = serializers.CharField(source='sale_master.customer')  

    class Meta:
        model = SaleDetails
        fields = ['id', 'item_name', 'quantity', 'brand_name', 'price', 'amount', 'datetime', 'status', 'sale_master', 'total_amount', 'customer_name']
