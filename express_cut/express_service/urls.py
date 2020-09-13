from django.urls import path
from . import views
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('', views.index, name='index'),
    url(r'stylists/', views.StylistList.as_view())
]
