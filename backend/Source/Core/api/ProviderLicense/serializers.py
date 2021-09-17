from rest_framework import serializers
from Core.models import ProviderLicense
from Core.models import Application
from Core.models import Provider
from Core.models import LicenseType


class ProviderLicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderLicense
        fields = ['Id', 'ProviderRef', 'ApplicationRef', 'LicenseTypeRef', 'StartDate', 'IsUnitsApplicable', 'NoOfUnits', 'Status']








