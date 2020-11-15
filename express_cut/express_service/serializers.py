from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import User, Service, DailySchedule, Reservation, TimeSlot, ReservationContainsServices
from django.contrib.auth.hashers import make_password
import datetime

class GeneralUserSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, read_only=True)
    username = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'role']

    def update(self, instance, validated_data):
        new_password = validated_data.get('password')
        if new_password:
            validated_data['password'] = make_password(new_password)
        instance.password = validated_data.get('password', instance.password)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance


class SingUpUserSerializer(GeneralUserSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(required=True)

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return User.objects.create(**validated_data)


class TimeSlotSerializer(serializers.ModelSerializer):

    class Meta:
        model = TimeSlot
        fields = ['start_time', 'end_time']


class StylistSerializer(GeneralUserSerializer):

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']


class CustomerSerializer(GeneralUserSerializer):

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']


class ManagerSerializer(GeneralUserSerializer):

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']


class DailyScheduleSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    timeslots = TimeSlotSerializer(many=True)

    class Meta:
        model = DailySchedule
        fields = ['id', 'date', 'stylist', 'timeslots']

    def create(self, validated_data):
        timeslots_data = validated_data.pop('timeslots')
        dailyschedule = DailySchedule.objects.create(**validated_data)
        for timeslot_data in timeslots_data:
            TimeSlot.objects.create(dailySchedule=dailyschedule, **timeslot_data)
        return dailyschedule

    def update(self, instance, validated_data):
        timeslots_data = validated_data.pop('timeslots')
        instance.timeslots.all().delete()
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        for timeslot_data in timeslots_data:
            TimeSlot.objects.create(dailySchedule=instance, **timeslot_data)
        return instance


class ServiceSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'serviceName', 'defaultDuration', 'description']

    def create(self, validated_data):
        return Service.objects.create(**validated_data)


class ReservationContainsServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = 'ReservationContainsServices'
        fields = "__all__"


class ReservationSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
    endTime = serializers.TimeField(read_only=True)
    status = serializers.ChoiceField(choices=Reservation.STATUS, read_only=True)
    service = serializers.PrimaryKeyRelatedField(many=True, required=True, queryset=Service.objects.all())


    class Meta:
        model = Reservation
        fields = ['id', 'status', 'timestamp', 'date', 'startTime', 'endTime', 'note', 'customer', 'stylist', 'service']

    @staticmethod
    def validate_reservation(startTime, endTime, date, stylist):
        if startTime > endTime:
            raise ValidationError("Start-time is bigger then the end-time.")
        try:
            schedule = stylist.dailyschedule_set.get(date=date)
        except DailySchedule.DoesNotExist:
            raise ValidationError("Unable to find a slot for the given date.")
        time_slot = schedule.timeslots.filter(start_time__lte=startTime, end_time__gte=endTime)
        # TODO: what if there is more than one schedule for a stylist in one day (this shouldn't happen)
        if not time_slot:
            raise ValidationError("Unable to find a slot for the given timeframe.")
        reservations = Reservation.objects.filter(stylist=stylist.pk, date=date)
        if not reservations:
            return None
        conflict_reserv = reservations.filter(startTime__gt=endTime, startTime__lt=startTime)
        if conflict_reserv:
            raise ValidationError("Unable to find a slot for the given timeframe.")
        conflict_reserv = reservations.filter(endTime__gt=endTime, endTime__lt=startTime)
        if conflict_reserv:
            raise ValidationError("Unable to find a slot for the given timeframe.")

    def create(self, validated_data):
        startTime = validated_data['startTime']
        endTime = (datetime.datetime.combine(datetime.date.today(), startTime) + datetime.timedelta(minutes=30)).time()
        #TODO: Call estimated_reservation_time
        self.validate_reservation(startTime, endTime, validated_data['date'],
                                  validated_data['stylist'])
        return Reservation(**validated_data)

class ListDurationSerializer(serializers.ListSerializer):

    def update(self, instance, validated_data):
        reserv_serv_data = instance.reservationcontainsservices_set.all()
        for update_data in validated_data:
            service = update_data['service']
            duration = update_data['duration']
            relation = reserv_serv_data.get(service=service.pk)
            relation.duration = duration
            relation.save()
        return instance.reservationcontainsservices_set


class DurationSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all(), required=True)
    duration = serializers.TimeField(required=True)

    def validate_service(self, value):
        if self.instance:
            try:
                self.instance.reservationcontainsservices_set.get(service=value.pk)
            except ReservationContainsServices.DoesNotExist:
                raise serializers.ValidationError("Service with id: %d doesn't belong to the reservation." % value.pk)
        return value

    class Meta:
        model = Reservation
        fields = ['service', 'duration']
        list_serializer_class = ListDurationSerializer



