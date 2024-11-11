from rest_framework import serializers
from .models import BrandMaster,Item

class BrandMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandMaster
        fields = '__all__'  # This will serialize all fields of the BrandMaster model

class ItemSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.brand_name', read_only=True)  # Access the related brand name

    class Meta:
        model = Item
        fields = ['id', 'item_name', 'category', 'unit_price', 'status', 'image', 'added_on', 'brand', 'brand_name']  # Include 'brand_name'
