from django.db import models
from django_pandas.managers import DataFrameManager


class AllPlayers(models.Model):
    player_id = models.IntegerField(primary_key=True)
    first_name = models.CharField()
    last_name = models.CharField()
    is_active = models.BooleanField()
    bb_ref_link = models.URLField()


class AllTeams(models.Model):
    team_id = models.IntegerField(primary_key=True)
    team_city = models.CharField()
    team_nickname = models.CharField()
    bb_ref_link = models.URLField()
