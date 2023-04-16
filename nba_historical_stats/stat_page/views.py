from django.shortcuts import render
from django.http import HttpResponse


def home(request):
    return render(request, 'stat_page/stat_page.html')


def about(request):
    return render(request, 'stat_page/about.html')
