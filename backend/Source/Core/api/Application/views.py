from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from Core.models import Application
from Core.api.Application.serializers import ApplicationSerializer
from Core.api.Application.serializers import ApplicationDropdownSerializer


@api_view(['GET',])
def api_application_dropdown_view(request):
    try:
        application = Application.objects.all()
    except Application.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = ApplicationDropdownSerializer(application,  many=True)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)


@api_view(['GET', ])
def api_application_view(request, id):
    try:
        application = Application.objects.get(Id=id)
    except Application.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = ApplicationSerializer(application)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)


@api_view(['GET', ])
def api_application_get_all_view(request):
    try:
        application = Application.objects.all()
    except Application.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = ApplicationSerializer(application, many=True)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)


@api_view(['PUT', ])
def api_update_application_view(request, id):
    try:
        application = Application.objects.get(Id=id)
    except Application.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "PUT":
        serializer = ApplicationSerializer(application, data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.save()
            data = {}
            data['success'] = "Application updated successfully !"
            data['status'] = status.HTTP_201_CREATED
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', ])
def api_create_application_view(request):
    try:
        application = Application()
    except Application.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "POST":
        serializer = ApplicationSerializer(application, data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.save()
            data = {}
            data['success'] = "Application created successfully !"
            data['status'] = status.HTTP_201_CREATED
            data['data'] = serializer.data
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', ])
def api_delete_application_recode(request, id):
    try:
        application = Application.objects.get(Id=id)
    except Application.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "DELETE":
        operation = application.delete()
        data = {}
        if operation:
            data["success"] = "Application deleted successfully !"
            data['status'] = status.HTTP_200_OK
        else:
            data["failure"] = "Application deleted fail"
            data['status'] = status.HTTP_410_GONE
        return Response(data=data)
