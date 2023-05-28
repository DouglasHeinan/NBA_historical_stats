from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django_pandas.managers import DataFrameManager
from .models import AllPlayers, AllTeams
from nba_api.stats.static import players, teams
import random
import json

TEAM_COLORS = {
    "Atlanta Hawks": ["#C8102E", "#FDB927"],
    "Boston Celtics": ["#007A33", "#BA9653"],
    "Cleveland Cavaliers": ["#860038", "#FDBB30"],
    "New Orleans Pelicans": ["#0C2340", "#85714D"],
    "Chicago Bulls": ["#CE1141", "#000000"],
    "Dallas Mavericks": ["#00538C", "#B8C4CA"],
    "Denver Nuggets": ["#0E2240", "#FEC524"],
    "Golden State Warriors": ["#1D428A", "#FFC72C"],
    "Houston Rockets": ["#CE1141", "#000000"],
    "Los Angeles Clippers": ["#C8102E", "#1D428A"],
    "Los Angeles Lakers": ["#552583", "#FDB927"],
    "Miami Heat": ["#98002E", "#000000"],
    "Milwaukee Bucks": ["#00471B", "#EEE1C6"],
    "Minnesota Timberwolves": ["#0C2340", "#9EA2A2"],
    "Brooklyn Nets": ["#000000", "#FFFFFF"],
    "New York Knicks": ["#006BB6", "#F58426"],
    "Orlando Magic": ["#0077C0", "#C4CED4"],
    "Indiana Pacers": ["#002D62", "#FDBB30"],
    "Philadelphia 76ers": ["#006BB6", "#FFFFFF"],
    "Phoenix Suns": ["#1D1160", "#E56020"],
    "Portland Trail Blazers": ["#E03A3E", "#000000"],
    "Sacramento Kings": ["#5A2D81", "#63727A"],
    "San Antonio Spurs": ["#C4CED4", "#000000"],
    "Oklahoma City Thunder": ["#007AC1", "#EF3B24"],
    "Toronto Raptors": ["#CE1141", "#000000"],
    "Utah Jazz": ["#002B5C", "#00471B"],
    "Memphis Grizzlies": ["#5D76A9", "#12173F"],
    "Washington Wizards": ["#002B5C", "#E31837"],
    "Detroit Pistons": ["#C8102E", "#1D42BA"],
    "Charlotte Hornets": ["#1D1160", "#00788C"],
}



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
    check_team_colors()


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


def check_team_colors():
    all_teams = AllTeams.objects.all()
    for team in all_teams:
        if not team.team_color_one:
            team.team_color_one = TEAM_COLORS[team.full_name][0]
            team.team_color_two = TEAM_COLORS[team.full_name][1]


def about(request):
    return render(request, 'stat_page/about.html', {"title": "About"})


def rando_player(request):
    player_ids = []
    all_players = AllPlayers.objects.all()
    for player in all_players:
        player_ids.append(player.player_id)
    rand_int = random.choice(player_ids)
    rand_player = AllPlayers.objects.get(player_id=rand_int)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        player = {
            "first_name": rand_player.first_name,
            "last_name": rand_player.last_name,
            "bb_ref_link": rand_player.bb_ref_link
        }
        return JsonResponse(player)



