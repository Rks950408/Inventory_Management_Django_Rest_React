from rest_framework import serializers
from .models import PurchaseMaster, PurchaseDetails
from item_master.models import Item
from supplier.models import Supplier

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