# inventory_management/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('items_master/', include('item_master.urls')),  # Correctly includes the item_master.urls
    path('supplier/', include('supplier.urls')),
    path('purchases/', include('purchase.urls')),
]
