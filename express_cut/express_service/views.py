from django.shortcuts import render
from django.http import HttpResponse
from .models import Stylist
from .serializers import StylistSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class StylistList(APIView):
    def get(self, request):
        stylists = Stylist.objects.all().order_by('first_name')
        serializer = StylistSerializer(stylists, many=True)
        return Response(serializer.data)


def index(request):
    return HttpResponse("Welcome to Express Cuts")

