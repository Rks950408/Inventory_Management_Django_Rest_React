from rest_framework import serializers
from .models import PurchaseMaster, PurchaseDetails,SaleDetails,SaleMaster
from item_master.models import Item
from supplier.models import Supplier
from .supplier_serializers import SupplierSerializer  # Corrected import
class PurchaseDetailsSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(write_only=True)  # Accepts item name from frontend instead of ID

    class Meta:
        model = PurchaseDetails
        fields = ['item_name', 'brand_name', 'quantity', 'price', 'amount']

    def validate_item_name(self, value):
        try:
            item = Item.objects.get(item_name=value)  # Convert item_name to item instance
            return item
        except Item.DoesNotExist:
            raise serializers.ValidationError(f"Item '{value}' not found.")

    def create(self, validated_data):
        item_instance = validated_data.pop('item_name')  # Replace item_name with item instance
        purchase_detail = PurchaseDetails.objects.create(item=item_instance, **validated_data)
        return purchase_detail


class PurchaseMasterSerializer(serializers.ModelSerializer):
    supplier = serializers.CharField(write_only=True)  # Accepts supplier name instead of ID
    purchase_details = PurchaseDetailsSerializer(many=True)  # Nested serializer for multiple purchase details

    class Meta:
        model = PurchaseMaster
        fields = ['invoice_no', 'invoice_date', 'supplier', 'total_amount', 'purchase_details']

    def validate_supplier(self, value):
        try:
            supplier = Supplier.objects.get(name=value)  # Convert supplier name to supplier instance
            return supplier
        except Supplier.DoesNotExist:
            raise serializers.ValidationError(f"Supplier '{value}' not found.")

    def create(self, validated_data):
        supplier_instance = validated_data.pop('supplier')
        purchase_details_data = validated_data.pop('purchase_details')

        # Create PurchaseMaster entry
        purchase_master = PurchaseMaster.objects.create(
            supplier=supplier_instance,
            **validated_data
        )

        # Create PurchaseDetails entries
        for detail_data in purchase_details_data:
            item = detail_data.pop('item_name')  # Retrieve item instance from validated data
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

# Serializer for PurchaseDetails, including item_name
class PurchaseDetailsSerializer2(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.item_name', read_only=True)  # Correct field name

    class Meta:
        model = PurchaseDetails
        fields = ['id', 'item_name', 'brand_name', 'quantity', 'price', 'amount', 'datetime', 'status']

# Serializer for PurchaseMaster with nested PurchaseDetails
class PurchaseMasterSerializer2(serializers.ModelSerializer):
    purchase_details = PurchaseDetailsSerializer2(source='purchasedetails_set', many=True)  # Related field name might vary
    supplier = SupplierSerializer()  # Include the supplier details
    class Meta:
        model = PurchaseMaster
        fields = ['id', 'invoice_no', 'invoice_date', 'supplier', 'total_amount', 'datetime', 'status', 'purchase_details']


# sale serializers
class SaleDetailsSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(write_only=True)  # Accepts item name from frontend

    class Meta:
        model = SaleDetails
        fields = ['item_name', 'brand_name', 'quantity', 'price', 'amount', 'status']

    def validate_item_name(self, value):
        try:
            item = Item.objects.get(item_name=value)  # Convert item_name to item instance
            return item
        except Item.DoesNotExist:
            raise serializers.ValidationError(f"Item '{value}' not found.")

    def create(self, validated_data):
        item_instance = validated_data.pop('item_name')  # Replace item_name with item instance
        sale_detail = SaleDetails.objects.create(item=item_instance, **validated_data)
        return sale_detail

class SaleMasterSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(write_only=True)  # Accepts supplier name instead of ID
    sale_details = SaleDetailsSerializer(many=True)  # Nested serializer for multiple sale details

    class Meta:
        model = SaleMaster
        fields = ['invoice_no', 'invoice_date', 'customer', 'total_amount', 'sale_details', 'status']

    def validate_customer(self, value):
        try:
            customer = Supplier.objects.get(name=value)  # Convert customer name to supplier instance
            return customer
        except Supplier.DoesNotExist:
            raise serializers.ValidationError(f"Customer '{value}' not found.")

    def create(self, validated_data):
        customer_instance = validated_data.pop('customer')
        sale_details_data = validated_data.pop('sale_details')

        # Create SaleMaster entry
        sale_master = SaleMaster.objects.create(customer=customer_instance, **validated_data)

        # Create SaleDetails entries
        for detail_data in sale_details_data:
            item = detail_data.pop('item_name')  # Retrieve item instance from validated data
            SaleDetails.objects.create(
                sale_master=sale_master,
                item=item,
                **detail_data
            )

        return sale_master


# ------------------------second---------------------
# Serializer for SaleDetails
# class SaleDetailsSerializer1(serializers.ModelSerializer):
#     item_name = serializers.CharField(write_only=True)  # Accepts item name from frontend

#     class Meta:
#         model = SaleDetails
#         fields = ['item_name', 'brand_name', 'quantity', 'price', 'amount', 'status']

#     def validate_item_name(self, value):
#         try:
#             item = Item.objects.get(item_name=value)  # Convert item_name to item instance
#             return item
#         except Item.DoesNotExist:
#             raise serializers.ValidationError(f"Item '{value}' not found.")

#     def create(self, validated_data):
#         item_instance = validated_data.pop('item_name')  # Replace item_name with item instance
#         sale_detail = SaleDetails.objects.create(item=item_instance, **validated_data)
#         return sale_detail

# class SaleMasterSerializer1(serializers.ModelSerializer):
#     sale_details = SaleDetailsSerializer1(many=True)  # Nested serializer for SaleDetails

#     class Meta:
#         model = SaleMaster
#         fields = ['id', 'invoice_no', 'invoice_date', 'total_amount', 'sale_details']  # Correct the field name to invoice_date


class SaleDetailsSerializer1(serializers.ModelSerializer):
    # Retrieve the item_name from the related Item object
    item_name = serializers.CharField(source='item.item_name', read_only=True)

    class Meta:
        model = SaleDetails
        fields = ['item_name', 'brand_name', 'quantity', 'price', 'amount', 'status']


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier  # Assuming the Supplier model has fields like id, name, contact, etc.
        fields = ['id', 'name', 'contact', 'address', 'status', 'entry_date']


class SaleMasterSerializer1(serializers.ModelSerializer):
    # Nested serializer for the customer/supplier details
    customer = SupplierSerializer(read_only=True)
    sale_details = SaleDetailsSerializer1(many=True)  # Nested serializer for SaleDetails

    class Meta:
        model = SaleMaster
        fields = ['id', 'invoice_no', 'invoice_date', 'total_amount', 'customer', 'sale_details']
