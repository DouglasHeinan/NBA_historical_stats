from django.db import models
# from django_pandas.managers import DataFrameManager


class AllPlayers(models.Model):
    player_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    is_active = models.BooleanField()
    bb_ref_link = models.URLField()


class AllTeams(models.Model):
    team_id = models.IntegerField(primary_key=True)
    team_city = models.CharField(max_length=50)
    team_nickname = models.CharField(max_length=50)
    bb_ref_link = models.URLField()