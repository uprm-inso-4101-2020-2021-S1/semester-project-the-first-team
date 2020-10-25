from rest_framework import serializers
from .models import Stylist, User, DailySchedule
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


class DailyScheduleSerializer(serializers.ModelSerializer):
    # date = serializers.DateField(required=True)
    # stylist_id = serializers.PrimaryKeyRelatedField(required=True)

    # TODO: For PUT HTTP methods fields don't need to be required
    # TODO: Roles cant be updated to other roles on put.

    class Meta:
        model = DailySchedule
        fields = ['date', 'stylist_id']
        
    def is_valid(self, raise_exception=False):

        super(DailyScheduleSerializer, self).is_valid(self, raise_exception)
        # Verify if the stylist exists
        stylist = User.objects.get(pk=self.validated_data['stylist_id'], role=User.STYLIST)
        return True
