from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from Core.models import LicenseType
from Core.api.LicenseType.serializers import LicenseTypeSerializer
from Core.api.LicenseType.serializers import LicenseTypeDropdownSerializer


@api_view(['GET',])
def api_license_type_dropdown_view(request):
    try:
        licenseType = LicenseType.objects.all()
    except LicenseType.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = LicenseTypeDropdownSerializer(licenseType, many=True)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)



@api_view(['GET',])
def api_LicenseType_view(request, id):
    try:
        licenseType = LicenseType.objects.get(Id=id)
    except LicenseType.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = LicenseTypeSerializer(licenseType)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)


@api_view(['GET',])
def api_LicenseType_get_all_view(request):
    try:
        licenseType = LicenseType.objects.all()
    except LicenseType.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = LicenseTypeSerializer(licenseType, many=True)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)


@api_view(['PUT',])
def api_update_LicenseType_view(request, id):
    try:
        licenseType = LicenseType.objects.get(Id=id)
    except LicenseType.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "PUT":
        serializer = LicenseTypeSerializer(licenseType, data=request.data)
        data ={}
        if serializer.is_valid():
            serializer.save()
            data = {}
            data['success'] = "License Type updated successfully !"
            data['status'] = status.HTTP_201_CREATED
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST',])
def api_create_LicenseType_view(request):
    try:
        licenseType = LicenseType()
    except LicenseType.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "POST":
        serializer = LicenseTypeSerializer(licenseType, data=request.data)
        data ={}
        if serializer.is_valid():
            serializer.save()
            data = {}
            data['success'] = "License Type created successfully !"
            data['status'] = status.HTTP_201_CREATED
            data['data'] = serializer.data
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', ])
def api_delete_licenseType_recode(request, id):
    try:
        licenseType = LicenseType.objects.get(Id=id)
    except LicenseType.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "DELETE":
        operation = licenseType.delete()
        data = {}
        if operation:
            data["success"] = "LicenseType deleted successfully !"
            data['status'] = status.HTTP_200_OK
        else:
            data["failure"] = "LicenseType deleted fail"
            data['status'] = status.HTTP_410_GONE
        return Response(data=data)