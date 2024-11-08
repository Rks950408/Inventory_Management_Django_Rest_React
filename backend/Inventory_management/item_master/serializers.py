from rest_framework import serializers
from .models import BrandMaster,Item

class BrandMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandMaster
        fields = '__all__'  # This will serialize all fields of the BrandMaster model

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'  
