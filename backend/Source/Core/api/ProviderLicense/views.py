from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from Core.models import ProviderLicense
from Core.api.ProviderLicense.serializers import ProviderLicenseSerializer


@api_view(['GET',])
def api_provider_license_view(request, id):
    try:
        providerLicense = ProviderLicense.objects.get(Id=id)
    except ProviderLicense.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = ProviderLicenseSerializer(providerLicense)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)


@api_view(['GET', ])
def api_provider_license_get_all_view(request):
    try:
        providerLicense = ProviderLicense.objects.all()
    except ProviderLicense.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = ProviderLicenseSerializer(providerLicense, many=True)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)


@api_view(['PUT',])
def api_update_provider_license_view(request, id):
    try:
        providerLicense = ProviderLicense.objects.get(Id=id)
    except ProviderLicense.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "PUT":
        serializer = ProviderLicenseSerializer(providerLicense, data=request.data)
        data ={}
        if serializer.is_valid():
            serializer.save()
            data = {}
            data['success'] = "Provider License updated successfully !"
            data['status'] = status.HTTP_201_CREATED
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST',])
def api_create_provider_license_view(request):
    try:
        providerLicense = ProviderLicense()
    except ProviderLicense.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "POST":
        serializer = ProviderLicenseSerializer(providerLicense, data=request.data)
        data ={}
        if serializer.is_valid():
            serializer.save()
            data = {}
            data['success'] = "Provider License created successfully !"
            data['status'] = status.HTTP_201_CREATED
            data['data'] = serializer.data
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', ])
def api_delete_provider_license_recode(request, id):
    try:
        providerLicense = ProviderLicense.objects.get(Id=id)
    except ProviderLicense.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "DELETE":
        operation = providerLicense.delete()
        data = {}
        if operation:
            data["success"] = "Provider License deleted successfully !"
            data['status'] = status.HTTP_200_OK
        else:
            data["failure"] = "Provider License deleted fail"
            data['status'] = status.HTTP_410_GONE
        return Response(data=data)