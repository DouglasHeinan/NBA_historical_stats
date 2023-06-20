from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django_pandas.managers import DataFrameManager
from .models import Player, Team, PlayerYearlyStats, PlayerCareerStats
from .admin import TEAM_COLORS_AND_LOGOS
from nba_api.stats.static import players, teams
from nba_api.stats.endpoints import playercareerstats
import random
import json
import pandas as pd
import plotly.express as px
import requests


def home(request):
    # ***THIS NEEDS TO BE CALLED IN ITS OWN FUNC***
    # update_db()
    # ******
    all_players = Player.objects.all()
    all_teams = Team.objects.all()
    context = {
        'players': all_players,
        'teams': all_teams
    }
    return render(request, 'stat_page/stat_page.html', context)


# db update player functions*******************************************
def update_db():
    all_players = players.get_players()
    all_teams = teams.get_teams()
    new_players = []
    new_teams = []
    for team in all_teams:
        if not Team.objects.filter(team_id=team["id"]).exists():
            new_teams.append(team)
    create_team_db_entries(new_teams)
    check_team_color_logo_entries()
    for player in all_players:
        if not Player.objects.filter(player_id=player["id"]).exists():
            new_players.append(player)
    create_player_db_entries(new_players)
    update_player_stats()


def create_player_db_entries(all_players):
    for player in all_players:
        new_player = Player(
            player_id=player["id"],
            first_name=player["first_name"],
            last_name=player["last_name"],
            is_active=player["is_active"],
            bb_ref_link=f"https://www.basketball-reference.com/players/{player['last_name'][0].lower()}/{(player['last_name'][0:5]).lower()}{player['first_name'][0:2].lower()}01.html"
        )
        new_player.save()
        create_player_statistical_db(new_player)


def create_player_statistical_db(player, stat_group):
    print(player.first_name + " " + player.last_name)
    print(player.player_id)
    raw_stats = playercareerstats.PlayerCareerStats(per_mode36="PerGame", player_id=player.player_id)
    all_player_stats = raw_stats.get_dict()
    if stat_group == "yearly":
        year_by_year_stats = all_player_stats['resultSets'][0]['rowSet']
        create_year_by_year_stat_entry(year_by_year_stats, player)
    elif stat_group == "career":
        career_stats = all_player_stats['resultSets'][1]['rowSet']
        create_career_stat_entry(career_stats, player)


def update_player_stats():
    for player in Player.objects.all():
        if not PlayerYearlyStats.objects.filter(player=player).exists():
            create_player_statistical_db(player, 'yearly')
        if not PlayerCareerStats.objects.filter(player=player).exists():
            create_player_statistical_db(player, 'career')



def create_year_by_year_stat_entry(stats, player):
    for stat in stats:
        new_entry = PlayerYearlyStats(
            year=stat[1],
            team=stat[4],
            age=stat[5],
            gp=stat[6],
            gs=stat[7],
            min=stat[8],
            fgm=stat[9],
            fga=stat[10],
            fg_pct=stat[11],
            fg3m=stat[12],
            fg3a=stat[13],
            fg3_pct=stat[14],
            ftm=stat[15],
            fta=stat[16],
            ft_pct=stat[17],
            oreb=stat[18],
            dreb=stat[19],
            treb=stat[20],
            ast=stat[21],
            stl=stat[22],
            blk=stat[23],
            tov=stat[24],
            pf=stat[25],
            pts=stat[26],
            player=player
        )
        new_entry.save()


def create_career_stat_entry(stats, player):
    for stat in stats:
        new_entry = PlayerCareerStats(
            gp=stat[3],
            gs=stat[4],
            min=stat[5],
            fgm=stat[6],
            fga=stat[7],
            fg_pct=stat[8],
            fg3m=stat[9],
            fg3a=stat[10],
            fg3_pct=stat[11],
            ftm=stat[12],
            fta=stat[13],
            ft_pct=stat[14],
            oreb=stat[15],
            dreb=stat[16],
            treb=stat[17],
            ast=stat[18],
            stl=stat[19],
            blk=stat[20],
            tov=stat[21],
            pf=stat[22],
            pts=stat[23],
            player=player
        )
        new_entry.save()


# db update team functions*******************************************

def create_team_db_entries(all_teams):
    for team in all_teams:
        new_team = Team(
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
    all_teams = Team.objects.all()
    for team in all_teams:
        if not team.team_logo:
            team.team_color_one = TEAM_COLORS_AND_LOGOS[team.team_abbreviation][0]
            team.team_color_two = TEAM_COLORS_AND_LOGOS[team.team_abbreviation][1]
            team.team_logo = TEAM_COLORS_AND_LOGOS[team.team_abbreviation][2]
            team.save()


# rand_player functions*******************************************
def rando_player(request):
    rand_player, career_stats, yearly_stats = determine_player()
    all_career_fields = PlayerCareerStats._meta.get_fields()
    all_yearly_fields = PlayerYearlyStats._meta.get_fields()

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        player = {
            "first_name": rand_player.first_name,
            "last_name": rand_player.last_name,
            "bb_ref_link": rand_player.bb_ref_link,
            "id" : rand_player.player_id
        }
        if career_stats:
            career_stats_dict = create_js_career_dict(career_stats, all_career_fields)
            yearly_stats_dict = create_js_yearly_dict(yearly_stats, all_yearly_fields)
        return JsonResponse([player, career_stats_dict, yearly_stats_dict], safe=False)


def determine_player():
    player_ids = []
    all_players = Player.objects.all()
    for player in all_players:
        player_ids.append(player.player_id)
    rand_int = random.choice(player_ids)
    rand_player = Player.objects.get(player_id=rand_int)
    try:
        career_stats = PlayerCareerStats.objects.get(player_id=rand_int)
        yearly_stats = PlayerYearlyStats.objects.filter(player=rand_int)
    except:
        career_stats = None
        yearly_stats = None
    return rand_player, career_stats, yearly_stats


def create_js_career_dict(stats, all_fields):
    js_dict = {}
    for i in range(len(all_fields) - 1):
        js_dict[all_fields[i].name] = getattr(stats, all_fields[i].name)
    return js_dict


def create_js_yearly_dict(stats, all_fields):
    js_dict = {}
    js_array = []
    for stat in stats:
        year_dict = {}
        for i in range(len(all_fields) - 1):
            year_dict[all_fields[i].name] = getattr(stat, all_fields[i].name)
        js_array.append(year_dict)
    js_dict["all_years"] = js_array
    return js_dict


# stat_charting functions******************************************
def chart_stat(request):
    return JsonResponse({"greeting" : "HELLO"})
