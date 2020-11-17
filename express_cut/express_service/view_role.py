from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from .serializers import StylistSerializer, CustomerSerializer, ManagerSerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import Permissions, CustomerViewPermissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from .swagger_models import SwagResponses as swagResp
import datetime


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(StylistSerializer)}, 
                    tags=['stylist'], operation_summary="Get All Express Cuts Stylists")
@api_view(['GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_all_stylists(request):
    if request.method == 'GET':
        stylists = User.objects.filter(role__exact=User.STYLIST)
        serializer = StylistSerializer(stylists, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(StylistSerializer)}, 
                    tags=['stylist'], operation_summary="Get All Express Cuts Stylists Available Today")
@api_view(['GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_all_available_stylists(request):
    if request.method == 'GET':
        stylists = User.objects.filter(dailyschedule__date=datetime.date.today())
        serializer = StylistSerializer(stylists, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(CustomerSerializer)}, 
                    tags=['customer'], operation_summary="Get All Express Cuts Customers")
@api_view(['GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_all_customers(request):
    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        customers = User.objects.filter(role__exact=User.CUSTOMER)
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(CustomerSerializer)},
                    tags=['customer'], operation_summary="A basic info. of Customer by id")
@api_view(['GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_customer_by_id(request, pk):
    if request.method == 'GET':
        try:
            customer = User.objects.get(pk=pk, role=User.CUSTOMER)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not CustomerViewPermissions().GET_permissions(request, obj=customer):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(ManagerSerializer)}, 
                    tags=['manager'], operation_summary="Get All Express Cuts Managers")
@api_view(['GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_all_managers(request):
    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        managers = User.objects.filter(role__exact=User.MANAGER)
        serializer = ManagerSerializer(managers, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
