from rest_framework import serializers
from .models import Stylist, User
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    pk = serializers.PrimaryKeyRelatedField(read_only=True)

    # TODO: For PUT HTTP methods fields don't need to be required

    class Meta:
        model = User
        fields = ['pk', 'username', 'first_name', 'last_name', 'email', 'role', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return User.objects.create(**validated_data)

