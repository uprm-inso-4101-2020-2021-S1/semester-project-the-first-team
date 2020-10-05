from rest_framework import serializers
from .models import Stylist, User
from django.contrib.auth.hashers import make_password


# class StylistSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = Stylist
#         fields = ('username', 'first_name', 'last_name', 'email')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'role']
        extra_kwargs = {'password': {'write_only': True}, }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return User.objects.create(**validated_data)

