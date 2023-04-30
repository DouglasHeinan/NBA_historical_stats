from nba_api.stats.static import players, teams


PLAYERS = players.get_players()
TEAMS = teams.get_teams()


def update_db(request):
    pass
