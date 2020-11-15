from django.db.models import Sum
from typing import List

from .models import Service, User
import datetime


def calculate_estimated_wait_time(services_id: List[int], stylist: User) -> datetime.timedelta:
    """
    Calculates the estimated duration of a reservation given some services and stylist to perform them.
    Args:
        services_id: Services' id of the services that will be offered, during the reservation.
        stylist: The id of the stylist that will perform the services.

    Returns: Estimated time of to complete the reservation.
    """
    services_with_estimate = stylist.stylistofferservices_set.filter(service__in=services_id).values_list('service',
                                                                                                          flat=True)
    stylist_estimate = stylist.stylistofferservices_set.filter(service__in=services_id).aggregate(
        estimate=Sum('EstimatedTime'))
    default_estimate = Service.objects.filter(pk__in=services_id).exclude(pk__in=services_with_estimate).aggregate(
        estimate=Sum('defaultDuration'))
    estimate_time = datetime.timedelta()
    if stylist_estimate['estimate']:
        estimate_time = stylist_estimate['estimate']
    if default_estimate['estimate']:
        estimate_time = estimate_time + datetime.timedelta(minutes=default_estimate['estimate'])
    total_minutes = int(estimate_time.seconds / 60)
    if total_minutes % 5:
        estimate_time = estimate_time + datetime.timedelta(minutes=(5 - (total_minutes % 5)))
    return estimate_time
