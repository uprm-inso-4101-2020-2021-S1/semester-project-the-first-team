from django.db.models import Sum
from typing import List
from django.db.models import Case, When, Max, BooleanField, Value
from .models import Service, User, DailySchedule, Reservation
import datetime
from django.utils import timezone

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


def get_available_slots(duration, stylist):
    today_date = datetime.datetime.now(tz=timezone.get_current_timezone()).date()
    is_last = False
    results = []
    try:
        schedule = stylist.dailyschedule_set.get(date=today_date)
    except DailySchedule.DoesNotExist:
        return []
    min_start_time = datetime.datetime.now(tz=timezone.get_current_timezone()) + datetime.timedelta(minutes=5)
    timeslots = schedule.timeslots.filter(end_time__gte=min_start_time.time()).order_by('start_time')
    if not timeslots:
        return []
    reservations_all = stylist.stylist_reservations.filter(date=today_date, endTime__gte=min_start_time.time())\
        .order_by('startTime')
    if not reservations_all:
        is_last = True
    else:
        last_reservation_pk = reservations_all.last().pk
    for timeslot in timeslots:
        available_start_time = timezone.make_aware(datetime.datetime.combine(date=today_date, time=timeslot.start_time))
        reservations = reservations_all.filter(startTime__gte=timeslot.start_time, endTime__lte=timeslot.end_time,
                                               status__in=[Reservation.IN_PROCESS, Reservation.PENDING])\
            .order_by('startTime')
        for reservation in reservations:
            available_end_time = timezone.make_aware(datetime.datetime.combine(date=today_date, time=reservation.startTime))
            slot = AvailableSlots(available_start_time, available_end_time)
            if reservation.pk == last_reservation_pk:
                is_last = True
                last_slot = slot.get_possible_reservation_slots(duration, many=False)
                if last_slot:
                    return results + last_slot
            else:
                results = results + slot.get_possible_reservation_slots(duration)
            available_start_time = timezone.make_aware(datetime.datetime.combine(date=today_date, time=reservation.endTime))
        available_end_time = timezone.make_aware(datetime.datetime.combine(date=today_date, time=timeslot.end_time))
        slot = AvailableSlots(available_start_time, available_end_time)
        if is_last:
            last_slot = slot.get_possible_reservation_slots(duration, many=False)
            if last_slot:
                return results + last_slot
        else:
            results = results + slot.get_possible_reservation_slots(duration)
    return results


# def time_to_timedelta(time):
#     hours = time.hour
#     minutes = time.minute
#     return datetime.timedelta(hours=hours, minutes=minutes)


class TimeSlot:

    def __init__(self, startTime, endTime):
        self.startTime = startTime
        self.endTime = endTime


class AvailableSlots:
    def __init__(self, dateTimeStart, dateTimeEnd):
        self.dateTimeStart = dateTimeStart
        self.dateTimeEnd = dateTimeEnd

    def get_possible_reservation_slots(self, duration, many=True):
        results = []
        time_now= datetime.datetime.now(tz=timezone.get_current_timezone())
        if self.dateTimeStart < time_now:
            temp_start = time_now + datetime.timedelta(minutes=5)
        else:
            temp_start = self.dateTimeStart
        temp_start = temp_start.replace(second=0, microsecond=0)
        if temp_start.minute % 5:
            temp_start = temp_start + datetime.timedelta(minutes=(5 - (temp_start.minute % 5)))
        while temp_start < self.dateTimeEnd:
            if temp_start + duration <= self.dateTimeEnd:
                results.append(TimeSlot(startTime=temp_start.time(), endTime=(temp_start+duration).time()))
                if not many:
                    return results
            temp_start = temp_start + duration
        return results
