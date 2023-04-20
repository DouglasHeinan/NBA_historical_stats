from django.shortcuts import render
from django.http import HttpResponse

players = [
    {
        'f_name': 'Michael',
        'l_name': 'Jordan',
        'position': 'SG/SF',
        'career_pts': 32292
    },
    {
        'f_name': 'Lebron',
        'l_name': 'James',
        'position': 'SF/PF',
        'career_pts': 38652
    }
]


def home(request):
    context = {
        'players': players
    }
    return render(request, 'stat_page/stat_page.html', context)


def about(request):
    return render(request, 'stat_page/about.html', {"title": "About"})
