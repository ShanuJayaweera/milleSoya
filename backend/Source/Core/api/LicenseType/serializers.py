from rest_framework import serializers
from Core.models import LicenseType


class LicenseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LicenseType
        fields = ['Id', 'Type', 'Name', 'Description', 'PaymentTerms', 'CycleInMonths', 'Status']


class LicenseTypeDropdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = LicenseType
        fields = ['id', 'Name']