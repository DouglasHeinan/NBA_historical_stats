from django.shortcuts import render
from django.http import HttpResponse
from nba_api.stats.static import players, teams
import random

players = players.get_players()


def home(request):
    context = {
        'players': players,
        'first_players': players[0:10],
        'active_players': [player for player in players if player['is_active']],
        'rando': rando_player(players)
    }
    return render(request, 'stat_page/stat_page.html', context)


def about(request):
    return render(request, 'stat_page/about.html', {"title": "About"})


def rando_player(player_list):
    print(len(player_list))
    total_players = len
    return "Steven Adams"

