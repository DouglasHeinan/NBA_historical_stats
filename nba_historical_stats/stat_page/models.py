from django.db import models


class Player(models.Model):
    player_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    is_active = models.BooleanField()
    bb_ref_link = models.URLField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Team(models.Model):
    team_id = models.IntegerField(primary_key=True)
    full_name = models.CharField(max_length=50)
    team_city = models.CharField(max_length=50)
    team_state = models.CharField(max_length=25)
    team_abbreviation = models.CharField(max_length=5)
    team_nickname = models.CharField(max_length=50)
    team_color_one = models.CharField(max_length=7, default="")
    team_color_two = models.CharField(max_length=7, default="")
    team_logo = models.URLField(default="")
    bb_ref_link = models.URLField()


class PlayerStats(models.Model):
    year = models.CharField(max_length=25)
    team = models.CharField(max_length=3)
    age = models.IntegerField()
    gp = models.IntegerField(null=True, default=0)
    gs = models.IntegerField(null=True, default=0)
    min = models.FloatField(null=True, default=0.0)
    fgm = models.FloatField(null=True, default=0.0)
    fga = models.FloatField(null=True, default=0.0)
    fg_pct = models.FloatField(null=True, default=0.0)
    fg3m = models.FloatField(null=True, default=0.0)
    fg3a = models.FloatField(null=True, default=0.0)
    fg3_pct = models.FloatField(null=True, default=0.0)
    ftm = models.FloatField(null=True, default=0.0)
    fta = models.FloatField(null=True, default=0.0)
    ft_pct = models.FloatField(null=True, default=0.0)
    oreb = models.FloatField(null=True, default=0.0)
    dreb = models.FloatField(null=True, default=0.0)
    treb = models.FloatField(null=True, default=0.0)
    ast = models.FloatField(null=True, default=0.0)
    stl = models.FloatField(null=True, default=0.0)
    blk = models.FloatField(null=True, default=0.0)
    tov = models.FloatField(null=True, default=0.0)
    pf = models.FloatField(null=True, default=0.0)
    pts = models.FloatField(null=True, default=0.0)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)

