from django.shortcuts import render
from django.http import HttpResponse
from django_pandas.managers import DataFrameManager
from .models import AllPlayers, AllTeams
import random


def home(request):
    players = AllPlayers.objects.all()
    print(f'****************************{players}')
    update_db(players)
    context = {
        'players': players
    }
    return render(request, 'stat_page/stat_page.html', context)


def about(request):
    return render(request, 'stat_page/about.html', {"title": "About"})


def rando_player(player_list):
    total_players = len(player_list)
    player_index = random.randrange(total_players)
    return player_list[player_index]


def determine_bb_ref_link(player):
    return f"{player['last_name'][0].lower()}/{(player['last_name'][0:5]).lower()}{player['first_name'][0:2].lower()}01.html"


def update_db(players):
    for player in players:
        if not AllPlayers.objects.filter(player_id=player.id).first():
            new_player = AllPlayers(
                player_id=player.id,
                first_name=player.first_name,
                last_name=player.last_name,
                is_active=player.is_active,
                bb_ref_link=f"https://www.basketball-reference.com/players/{player['last_name'][0].lower()}/{(player['last_name'][0:5]).lower()}{player['first_name'][0:2].lower()}01.html"
            )
            new_player.save()

