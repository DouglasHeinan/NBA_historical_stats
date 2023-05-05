from nba_api.stats.static import players, teams
from models import AllPlayers


PLAYERS = players.get_players()
TEAMS = teams.get_teams()


def update_db(request):
    print(PLAYERS[0])
#     RETRIEVE DATABASE,
#     ITERATE THROUGH ALL ROWS OF DATABASE, UPDATING STATS,
#     ADD PLAYERS NOT YET IN DATABASE AND THEIR STATS
