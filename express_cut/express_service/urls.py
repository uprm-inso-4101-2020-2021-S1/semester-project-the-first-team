from django.urls import path
from . import views, view_service, view_role, view_reservation, view_schedule
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import permissions
from rest_framework_jwt.views import obtain_jwt_token
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
    path('user', views.get_all_users),
    path('user/<int:pk>', views.users_views),
    path('user/signup', views.user_signup_view),
    path('user/login', obtain_jwt_token),
    path('user/current', views.current_user),
    
    path('schedule', view_schedule.schedule_views),
    path('schedule/<int:pk>', view_schedule.schedule_views_put),
    path('stylist/<int:stylist_id>/schedule', view_schedule.get_all_schedule_by_stylist),

    path('service', view_service.get_all_services),
    path('service/<int:pk>', view_service.get_service_views),

    path('reservation', view_reservation.reservation_general),
    path('reservation/<int:pk>', view_reservation.reservation_views),
    path('reservation/<int:pk>/cancel', view_reservation.cancel_reservation),
    path('reservation/estimate', view_reservation.estimate_reservation_time),
    path('reservation/<int:reservation_id>/complete', view_reservation.complete_reservation),

    path('stylist', view_role.get_all_stylists),
    path('stylist/<int:stylist_id>/reservation', view_reservation.reservations_by_stylist),
    path('stylist/available', view_role.get_all_available_stylists),
    path('customer', view_role.get_all_customers),
    path('manager', view_role.get_all_managers),

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
