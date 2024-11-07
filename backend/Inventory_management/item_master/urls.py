# item_master/urls.py
from django.urls import path
from .views import create_brand, get_brand

urlpatterns = [
    path('create_brand/', create_brand, name='create_brand'),  # Correct path for creating a brand
     path('get_brands/', get_brand, name='get_brands'),
]
