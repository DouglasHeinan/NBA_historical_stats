from django.shortcuts import render
from django.http import HttpResponse
from nba_api.stats.static import players, teams
import random

players = players.get_players()


def home(request):
    rando = rando_player(players)
    context = {
        'players': players,
        'first_players': players[0:10],
        'active_players': [player for player in players if player['is_active']],
        'rando': rando,
        'bb_ref_link': f"{rando['last_name'][0].lower()}/{(rando['last_name'][0:5]).lower()}{rando['first_name'][0:2].lower()}01.html"
    }
    return render(request, 'stat_page/stat_page.html', context)


def about(request):
    return render(request, 'stat_page/about.html', {"title": "About"})


def rando_player(player_list):
    total_players = len(player_list)
    player_index = random.randrange(total_players)
    return player_list[player_index]

