from django.urls import path
from .views import get_items, create_item, update_item, delete_item
from . import views

urlpatterns = [
    path('items/', get_items, name='get_items'),  # GET request to list items
    path('items/create/', create_item, name='create_item'),  # POST request to create an item
    path('items/update/<int:pk>/', update_item, name='update_item'),  # PUT request to update an item
    path('items/delete/<int:pk>/', delete_item, name='delete_item'),  # DELETE request to delete an item
]
