from rest_framework import serializers
from .models import User, Service, DailySchedule, Reservation, TimeSlot, ReservationContainsServices, Feedback
from django.contrib.auth.hashers import make_password


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


class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feedback
        fields = "__all__"
