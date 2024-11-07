from rest_framework import serializers
from .models import BrandMaster,Item

class BrandMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandMaster
        fields = ['brand_name']  # Only include brand_name in the API

    def create(self, validated_data):
        # Automatically set the 'status' to True and 'datetime' will be auto-added
        validated_data['status'] = True  # Default status
        return super().create(validated_data)


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'  
