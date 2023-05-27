from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django_pandas.managers import DataFrameManager
from .models import AllPlayers, AllTeams
from nba_api.stats.static import players
import random
import json



def home(request):
    all_players = AllPlayers.objects.all()
    if not all_players:
        createDatabase()
    update_db()
    context = {
        'players': all_players
    }
    return render(request, 'stat_page/stat_page.html', context)


def about(request):
    return render(request, 'stat_page/about.html', {"title": "About"})


def rando_player(request):
    player_ids = []
    for player in AllPlayers.objects.all():
        player_ids.append(player.player_id)
    rand_int = random.choice(player_ids)
    rand_player = AllPlayers.objects.get(player_id=rand_int)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        player = {
            # "player_id": rand_player.player_id,
            "first_name": rand_player.first_name,
            "last_name": rand_player.last_name,
            "bb_ref_link": rand_player.bb_ref_link
        }
        return JsonResponse(player)


def determine_bb_ref_link(player):
    return f"{player['last_name'][0].lower()}/{(player['last_name'][0:5]).lower()}{player['first_name'][0:2].lower()}01.html"


def createDatabase():
    all_players = players.get_players()
    for player in all_players:
        new_player = AllPlayers(
            player_id=player["id"],
            first_name=player["first_name"],
            last_name=player["last_name"],
            is_active=player["is_active"],
            bb_ref_link=f"https://www.basketball-reference.com/players/{player['last_name'][0].lower()}/{(player['last_name'][0:5]).lower()}{player['first_name'][0:2].lower()}01.html"
        )
        new_player.save()



def update_db():
    all_players = players.get_players()
    for player in all_players:
        if not AllPlayers.objects.filter(player_id=player["id"]).exists():
            new_player = AllPlayers(
                player_id=player["id"],
                first_name=player["first_name"],
                last_name=player["last_name"],
                is_active=player["is_active"],
                bb_ref_link=f"https://www.basketball-reference.com/players/{player['last_name'][0].lower()}/{(player['last_name'][0:5]).lower()}{player['first_name'][0:2].lower()}01.html"
            )
            new_player.save()

