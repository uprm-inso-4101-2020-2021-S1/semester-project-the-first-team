from rest_framework import serializers
from .models import User, Service, DailySchedule, Reservation, TimeSlot
from django.contrib.auth.hashers import make_password


class GeneralUserSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role']


class SingUpUserSerializer(GeneralUserSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'password']

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
    pk = serializers.PrimaryKeyRelatedField(read_only=True)
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
        # fields = "__all__"
        fields = ['id', 'serviceName', 'defaultDuration', 'description']

    def create(self, validated_data):
        return Service.objects.create(**validated_data)


class ReservationSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
    endTime = serializers.TimeField(read_only=True)
    status = serializers.ChoiceField(choices=Reservation.STATUS, read_only=True)

    class Meta:
        model = Reservation
        fields = "__all__"
