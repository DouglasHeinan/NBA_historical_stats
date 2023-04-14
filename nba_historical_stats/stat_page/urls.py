from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='stats-home'),
    path('new_path/', views.PLACEHOLDER, name='PLACEHOLDER')
]
