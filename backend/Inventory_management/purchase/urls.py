from django.urls import path
from . import views

urlpatterns = [
    # path('create/', views.create_purchase, name='create_purchase'),
    # Add other URL patterns here
    path('purchase-entry/', views.create_purchase, name='purchase-entry'),
    path('purchases-get/', views.get_purchase_master, name='get_purchase_master'),
    path('purchases/<int:purchase_master_id>/',views.get_purchase_details_by_master_id, name='purchase-details-by-master-id'),
    path('total-quantity/<int:item_id>/', views.get_total_quantity_for_item, name='get_total_quantity_for_item'),
    # sale api urls
    path('sales/create/', views.create_sale, name='create_sale'),
    path('sales-get/', views.get_sale_master, name='get_sale_master'),

    # Endpoint to get sale details by Sale Master ID
    path('sale-details/<int:sale_master_id>/', views.get_sale_details_by_master_id, name='get_sale_details_by_master_id'),

    path('stock-list/', views.stock_list, name='stock_list_api'),
    path('details_sale_purchase/', views.details_sale_purchase, name='details_sale_purchase'),




]