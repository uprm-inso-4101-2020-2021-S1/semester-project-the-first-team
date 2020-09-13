from rest_framework import serializers

from .models import Stylist


class StylistSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Stylist
        fields = ('first_name', 'last_name')
