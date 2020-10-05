from django.urls import path
from . import views
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('', views.index, name='index'),
    url(r'stylist/', views.stylist_list),

]

Stylist_urlpatterns = [
    url(r'stylist/signup', views.stylist_signup),
]

Manager_urlpatterns = [
    url(r'manager/signup', views.manager_signup),
]
Client_urlpatterns = [
    url(r'client/singup', views.client_signup),
]


urlpatterns.extend(Stylist_urlpatterns)
urlpatterns.extend(Manager_urlpatterns)
