# item_master/urls.py
from django.urls import path
from .views import create_brand, get_brand
from . import views

urlpatterns = [
    path('create_brand/', create_brand, name='create_brand'),  # Correct path for creating a brand
    path('get_brands/', get_brand, name='get_brands'),
    # items urls
    path('items/create/', views.create_item, name='create_item'),
    path('items/', views.get_items, name='get_items'),
    path('items/<int:item_id>/', views.get_item, name='get_item'),
    path('items/<int:item_id>/update/', views.update_item, name='update_item'),
    path('items/<int:item_id>/delete/', views.delete_item, name='delete_item'),
]
