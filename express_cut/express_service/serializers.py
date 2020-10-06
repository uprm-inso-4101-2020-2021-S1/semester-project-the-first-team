from rest_framework import serializers
from .models import Stylist, User
from django.contrib.auth.hashers import make_password


# class StylistSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = Stylist
#         fields = ('username', 'first_name', 'last_name', 'email')

# class MyChoiceField(serializers.ChoiceField):
#
#     def to_representation(self, data):
#         if data not in self.choices.keys():
#             self.fail('invalid_choice', input=data)
#         else:
#             return self.choices[data]
#
#     def to_internal_value(self, data):
#         for key, value in self.choices.items():
#             if value == data:
#                  return key
#         self.fail('invalid_choice', input=data)


class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'role', 'password']
        # role = serializers.HiddenField(default = 0)
        # extra_kwargs = {'password': {'write_only': True}, }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return User.objects.create(**validated_data)

