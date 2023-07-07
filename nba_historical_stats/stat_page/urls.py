from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='stats-home'),
    path('rando_player/', views.rando_player, name='rand-player-func'),
    path('search_player/', views.search_player, name='search_player_func')
]
