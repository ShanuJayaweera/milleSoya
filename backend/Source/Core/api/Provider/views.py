from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from Core.models import Provider
from Core.api.Provider.serializers import ProviderSerializer
from Core.api.Provider.serializers import ProviderDropdownSerializer


@api_view(['GET',])
def api_provider_dropdown_view(request):
    try:
        provider = Provider.objects.all()
    except Provider.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = ProviderDropdownSerializer(provider,  many=True)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)



@api_view(['GET',])
def api_provider_view(request, id):
    try:
        provider = Provider.objects.get(Id=id)
    except Provider.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = ProviderSerializer(provider)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)

@api_view(['GET', ])
def api_provider_get_all_view(request):
    try:
        provider = Provider.objects.all()
    except Provider.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = ProviderSerializer(provider,  many=True)
        data = {}
        data['success'] = "Data fetching success"
        data['status'] = status.HTTP_200_OK
        data['data'] = serializer.data
        return Response(data=data)


@api_view(['PUT',])
def api_update_provider_view(request, id):
    try:
        provider = Provider.objects.get(Id=id)
    except Provider.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "PUT":
        serializer = ProviderSerializer(provider, data=request.data)
        data ={}
        if serializer.is_valid():
            serializer.save()
            data = {}
            data['success'] = "Provider updated successfully !"
            data['status'] = status.HTTP_201_CREATED
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST',])
def api_create_provider_view(request):
    try:
        provider = Provider()
    except Provider.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "POST":
        serializer = ProviderSerializer(provider, data=request.data)
        data ={}
        if serializer.is_valid():
            serializer.save()
            data = {}
            data['success'] = "Provider created successfully !"
            data['status'] = status.HTTP_201_CREATED
            data['data'] = serializer.data
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', ])
def api_delete_provider_recode(request, id):
    try:
        provider = Provider.objects.get(Id=id)
    except Provider.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    if request.method == "DELETE":
        operation = provider.delete()
        data = {}
        if operation:
            data["success"] = "Provider deleted successfully !"
            data['status'] = status.HTTP_200_OK
        else:
            data["failure"] = "Provider deleted fail"
            data['status'] = status.HTTP_410_GONE
        return Response(data=data)