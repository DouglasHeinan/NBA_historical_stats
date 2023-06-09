from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='stats-home'),
    path('rando_json/', views.rando_player, name='rand-player-func')
]
