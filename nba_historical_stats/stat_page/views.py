from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django_pandas.managers import DataFrameManager
from .models import AllPlayers, AllTeams
from nba_api.stats.static import players, teams
import random
import json

TEAM_COLORS_AND_LOGOS = {
    "ATL": ["#C8102E", "#FDB927", "https://content.sportslogos.net/logos/6/220/thumbs/22081902021.gif"],
    "BOS": ["#007A33", "#BA9653", "https://content.sportslogos.net/logos/6/213/thumbs/slhg02hbef3j1ov4lsnwyol5o.gif"],
    "CLE": ["#860038", "#FDBB30", "https://content.sportslogos.net/logos/6/222/thumbs/22253692023.gif"],
    "NOP": ["#0C2340", "#85714D", "https://content.sportslogos.net/logos/6/4962/thumbs/496226812014.gif"],
    "CHI": ["#CE1141", "#000000", "https://content.sportslogos.net/logos/6/221/thumbs/hj3gmh82w9hffmeh3fjm5h874.gif"],
    "DAL": ["#00538C", "#B8C4CA", "https://content.sportslogos.net/logos/6/228/thumbs/22834632018.gif"],
    "DEN": ["#0E2240", "#FEC524", "https://content.sportslogos.net/logos/6/229/thumbs/22989262019.gif"],
    "GSW": ["#1D428A", "#FFC72C", "https://content.sportslogos.net/logos/6/235/thumbs/23531522020.gif"],
    "HOU": ["#CE1141", "#000000", "https://content.sportslogos.net/logos/6/230/thumbs/23068302020.gif"],
    "LAC": ["#C8102E", "#1D428A", "https://content.sportslogos.net/logos/6/236/thumbs/23637762019.gif"],
    "LAL": ["#552583", "#FDB927", "https://content.sportslogos.net/logos/6/237/thumbs/uig7aiht8jnpl1szbi57zzlsh.gif"],
    "MIA": ["#98002E", "#000000", "https://content.sportslogos.net/logos/6/214/thumbs/burm5gh2wvjti3xhei5h16k8e.gif"],
    "MIL": ["#00471B", "#EEE1C6", "https://content.sportslogos.net/logos/6/225/thumbs/22582752016.gif"],
    "MIN": ["#0C2340", "#9EA2A2", "https://content.sportslogos.net/logos/6/232/thumbs/23296692018.gif"],
    "BKN": ["#000000", "#FFFFFF", "https://content.sportslogos.net/logos/6/3786/thumbs/hsuff5m3dgiv20kovde422r1f.gif"],
    "NYK": ["#006BB6", "#F58426", "https://content.sportslogos.net/logos/6/216/thumbs/2nn48xofg0hms8k326cqdmuis.gif"],
    "ORL": ["#0077C0", "#C4CED4", "https://content.sportslogos.net/logos/6/217/thumbs/wd9ic7qafgfb0yxs7tem7n5g4.gif"],
    "IND": ["#002D62", "#FDBB30", "https://content.sportslogos.net/logos/6/224/thumbs/22448122018.gif"],
    "PHI": ["#006BB6", "#FFFFFF", "https://content.sportslogos.net/logos/6/218/thumbs/21870342016.gif"],
    "PHX": ["#1D1160", "#E56020", "https://content.sportslogos.net/logos/6/238/thumbs/23843702014.gif"],
    "POR": ["#E03A3E", "#000000", "https://content.sportslogos.net/logos/6/239/thumbs/23997252018.gif"],
    "SAC": ["#5A2D81", "#63727A", "https://content.sportslogos.net/logos/6/240/thumbs/24040432017.gif"],
    "SAS": ["#C4CED4", "#000000", "https://content.sportslogos.net/logos/6/233/thumbs/23325472018.gif"],
    "OKC": ["#007AC1", "#EF3B24", "https://content.sportslogos.net/logos/6/2687/thumbs/khmovcnezy06c3nm05ccn0oj2.gif"],
    "TOR": ["#CE1141", "#000000", "https://content.sportslogos.net/logos/6/227/thumbs/22770242021.gif"],
    "UTA": ["#002B5C", "#00471B", "https://content.sportslogos.net/logos/6/234/thumbs/23485132023.gif"],
    "MEM": ["#5D76A9", "#12173F", "https://content.sportslogos.net/logos/6/231/thumbs/23143732019.gif"],
    "WAS": ["#002B5C", "#E31837", "https://content.sportslogos.net/logos/6/219/thumbs/21956712016.gif"],
    "DET": ["#C8102E", "#1D42BA", "https://content.sportslogos.net/logos/6/223/thumbs/22321642018.gif"],
    "CHA": ["#1D1160", "#00788C", "https://content.sportslogos.net/logos/6/5120/thumbs/512019262015.gif"],
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
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        player = {
            "first_name": rand_player.first_name,
            "last_name": rand_player.last_name,
            "bb_ref_link": rand_player.bb_ref_link
        }
        return JsonResponse(player)



