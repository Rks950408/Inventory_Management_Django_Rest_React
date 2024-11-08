from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_supplier, name='create_supplier'),
    path('suppliers/', views.get_suppliers, name='get_suppliers'),  
    path('suppliers/create/', views.create_supplier, name='create_supplier'),  
]