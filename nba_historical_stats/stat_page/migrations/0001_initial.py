# Generated by Django 4.1.7 on 2023-05-27 23:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AllPlayers',
            fields=[
                ('player_id', models.IntegerField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('is_active', models.BooleanField()),
                ('bb_ref_link', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='AllTeams',
            fields=[
                ('team_id', models.IntegerField(primary_key=True, serialize=False)),
                ('full_name', models.CharField(max_length=50)),
                ('team_city', models.CharField(max_length=50)),
                ('team_state', models.CharField(max_length=25)),
                ('team_abbreviation', models.CharField(max_length=5)),
                ('team_nickname', models.CharField(max_length=50)),
                ('bb_ref_link', models.URLField()),
            ],
        ),
    ]