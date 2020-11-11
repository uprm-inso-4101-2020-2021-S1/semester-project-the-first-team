from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from .serializers import StylistSerializer, CustomerSerializer, ManagerSerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import Permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from .swagger_models import SwagResponses as swagResp
import datetime

@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(StylistSerializer)}, tags=['stylist'], )
@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def all_stylists(request):
    if request.method == 'GET':
        stylists = User.objects.filter(role__exact=User.STYLIST)
        serializer = StylistSerializer(stylists, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(StylistSerializer)}, tags=['stylist'], )
@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def all_available_stylists(request):
    if request.method == 'GET':
        stylists = User.objects.filter(dailyschedule__date=datetime.date.today())
        serializer = StylistSerializer(stylists, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(CustomerSerializer)}, tags=['customer'], )
@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def all_customers(request):
    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        customers = User.objects.filter(role__exact=User.CUSTOMER)
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(ManagerSerializer)}, tags=['manager'], )
@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def all_managers(request):
    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        managers = User.objects.filter(role__exact=User.MANAGER)
        serializer = ManagerSerializer(managers, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
