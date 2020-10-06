from django.urls import path
from . import views
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Express Cuts",
      default_version='v1',
      description="OpenAPI definition for the Express Cuts Rest API",
   ),
   public=True,
)

urlpatterns = [
    path('', views.index, name='index'),
    url(r'stylist/', views.stylist_list),
    
    # OPENAPI SPEC drf_yasg
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
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
urlpatterns.extend(Client_urlpatterns)