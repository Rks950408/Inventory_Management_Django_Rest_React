from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_supplier, name='create_supplier'),
    # Add other URL patterns here
]