from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='stats-home'),
    path('rando_json/', views.rando_player, name='rand-player-func'),
    path('chart_stat/', views.chart_stat, name='chart_stat_func')
]
