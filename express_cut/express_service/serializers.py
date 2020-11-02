from rest_framework import serializers
from .models import Stylist, User, Service, DailySchedule
from django.contrib.auth.hashers import make_password



class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    pk = serializers.PrimaryKeyRelatedField(read_only=True)
    password = serializers.CharField(write_only=True, required=True)

    # TODO: For PUT HTTP methods fields don't need to be required
    # TODO: Roles cant be updated to other roles on put.
    
    class Meta:
        model = User
        fields = ['pk', 'username', 'first_name', 'last_name', 'email', 'role', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return User.objects.create(**validated_data)


class StylistSerializer(UserSerializer):

    class Meta:
        model = User
        fields = ['pk', 'first_name', 'last_name']


class CustomerSerializer(UserSerializer):

    class Meta:
        model = User
        fields = ['pk', 'first_name', 'last_name']


class ManagerSerializer(UserSerializer):

    class Meta:
        model = User
        fields = ['pk', 'first_name', 'last_name']


class DailyScheduleSerializer(serializers.ModelSerializer):
    pk = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = DailySchedule
        fields = ['date', 'stylist', 'pk']
        
        
class ServiceSerializer(serializers.ModelSerializer):
    pk = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Service
        # fields = "__all__"
        fields = ['pk', 'serviceName', 'defaultDuration', 'description']

    def create(self, validated_data):
        return Service.objects.create(**validated_data)
