from django.shortcuts import render
from django.http import HttpResponse
from .models import Service
from .serializers import ServiceSerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import Permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from .swagger_models import SwagResponses as swagResp


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(ServiceSerializer)}, tags=['service'], )
@swagger_auto_schema(methods=['POST'], request_body=ServiceSerializer, responses=swagResp.commonPOSTResponses,
                     tags=['service'], )
@api_view(['GET','POST' ])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def all_services(request):
    if request.method == 'GET':
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'POST':
        data = request.data
        serializer = ServiceSerializer(data=data)
        if not serializer.is_valid():
            return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        try:
            service = serializer.save()
            return Response(data = {'pk': service.pk},status=status.HTTP_201_CREATED)
        except:
            return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['PUT'], request_body=ServiceSerializer, responses={**swagResp.commonResponses, **swagResp.getResponse(ServiceSerializer)},
                     tags=['service'], )
@swagger_auto_schema(methods=['GET', 'DELETE'], responses={**swagResp.commonResponses, **swagResp.getResponse(ServiceSerializer)},)
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def service_views(request, pk):
    try:
        service_obj = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ServiceSerializer(service_obj)
        return Response(serializer.data)

    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)

    elif request.method == 'PUT':
        serializer = ServiceSerializer(service_obj, data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except:
                return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            service_obj.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

