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
    path('user/', views.all_users),
    path('user/<int:pk>', views.users_views),
    path('user/signup', views.user_signup_view),
    path('schedule/', views.schedule_views),
    path('schedule/<int:pk>', views.schedule_views_put),
]

# Stylist_urlpatterns = [
#     path('stylist/signup', views.stylist_signup),
#     path('stylist/<int:pk>', views.stylist_view),
#     # url('stylist/', views.stylist_list),
# ]
#
# Manager_urlpatterns = [
#     url(r'manager/signup', views.manager_signup),
# ]
#
# Client_urlpatterns = [
#     url(r'customer/singup', views.customer_signup),
#     url(r'customer/', views.customer_list),
# ]

OPENAPI_urlpatterns = [
    # OPENAPI SPEC drf_yasg
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# urlpatterns.extend(Stylist_urlpatterns)
# urlpatterns.extend(Manager_urlpatterns)
# urlpatterns.extend(Client_urlpatterns)
urlpatterns.extend(OPENAPI_urlpatterns)
