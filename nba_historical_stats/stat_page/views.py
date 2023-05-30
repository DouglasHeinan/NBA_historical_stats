from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django_pandas.managers import DataFrameManager
from .models import AllPlayers, AllTeams
from .admin import TEAM_COLORS_AND_LOGOS
from nba_api.stats.static import players, teams
from nba_api.stats.endpoints import playercareerstats
import random
import json





def home(request):
    update_db()
    all_players = AllPlayers.objects.all()
    all_teams = AllTeams.objects.all()
    context = {
        'players': all_players,
        'teams': all_teams
    }
    return render(request, 'stat_page/stat_page.html', context)


def update_db():
    all_players = players.get_players()
    all_teams = teams.get_teams()
    new_players = []
    new_teams = []
    for player in all_players:
        if not AllPlayers.objects.filter(player_id=player["id"]).exists():
            new_players.append(player)
    create_player_db_entries(new_players)
    for team in all_teams:
        if not AllTeams.objects.filter(team_id=team["id"]).exists():
            new_teams.append(team)
    create_team_db_entries(new_teams)
    check_team_color_logo_entries()


def create_player_db_entries(all_players):
    print("players")
    for player in all_players:
        new_player = AllPlayers(
            player_id=player["id"],
            first_name=player["first_name"],
            last_name=player["last_name"],
            is_active=player["is_active"],
            bb_ref_link=f"https://www.basketball-reference.com/players/{player['last_name'][0].lower()}/{(player['last_name'][0:5]).lower()}{player['first_name'][0:2].lower()}01.html"
        )
        new_player.save()


def create_team_db_entries(all_teams):
    print("teams")
    for team in all_teams:
        new_team = AllTeams(
            team_id=team["id"],
            full_name=team["full_name"],
            team_city=team["city"],
            team_state=team["state"],
            team_abbreviation=team["abbreviation"],
            team_nickname=team["nickname"],
            bb_ref_link=f"https://www.basketball-reference.com/teams/{team['abbreviation']}"
        )
        new_team.save()


def check_team_color_logo_entries():
    all_teams = AllTeams.objects.all()
    for team in all_teams:
        if not team.team_logo:
            team.team_color_one = TEAM_COLORS_AND_LOGOS[team.team_abbreviation][0]
            team.team_color_two = TEAM_COLORS_AND_LOGOS[team.team_abbreviation][1]
            team.team_logo = TEAM_COLORS_AND_LOGOS[team.team_abbreviation][2]
            team.save()


def about(request):
    return render(request, 'stat_page/about.html', {"title": "About"})


def rando_player(request):
    player_ids = []
    all_players = AllPlayers.objects.all()
    for player in all_players:
        player_ids.append(player.player_id)
    rand_int = random.choice(player_ids)
    rand_player = AllPlayers.objects.get(player_id=rand_int)
    # delete below***********************************************
    raw_career = playercareerstats.PlayerCareerStats(player_id=rand_player.player_id)
    career = raw_career.get_dict()['parameters']
    print("*******************************************")
    print(career)
    # delete above***********************************************
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        player = {
            "first_name": rand_player.first_name,
            "last_name": rand_player.last_name,
            "bb_ref_link": rand_player.bb_ref_link
        }
        return JsonResponse(player)



