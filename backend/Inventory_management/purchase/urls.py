from django.urls import path
from . import views

urlpatterns = [
    # path('create/', views.create_purchase, name='create_purchase'),
    # Add other URL patterns here
    path('purchase-entry/', views.create_purchase, name='purchase-entry'),
]