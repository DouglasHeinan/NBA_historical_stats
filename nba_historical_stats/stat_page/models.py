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
    full_name = models.CharField(max_length=50)
    team_city = models.CharField(max_length=50)
    team_state = models.CharField(max_length=25)
    team_abbreviation = models.CharField(max_length=5)
    team_nickname = models.CharField(max_length=50)
    team_color_one = models.CharField(max_length=7, default="")
    team_color_two = models.CharField(max_length=7, default="")
    bb_ref_link = models.URLField()
