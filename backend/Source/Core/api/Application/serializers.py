from rest_framework import serializers
from Core.models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['Id','Name', 'Description', 'Status']


class ApplicationDropdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'Name']

