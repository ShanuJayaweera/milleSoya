from rest_framework import serializers
from Core.models import Provider


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['Id','ExternalRef', 'Name', 'Address', 'PhoneNo', 'Email', 'Status']


class ProviderDropdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['id', 'Name']