from django.shortcuts import render
from django.http import HttpResponse
from .models import Stylist, User
from .serializers import  UserSerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import Permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from .swagger_models import SwagResponses as swagResp


def user_signup(request, role=None):
    data = request.data
    if role is not None:
        data['role'] = role
    serializer = UserSerializer(data=data)
    if not serializer.is_valid():
        return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response(status=status.HTTP_201_CREATED)


@swagger_auto_schema(
        methods=['POST'],
        request_body=UserSerializer,
        responses={**swagResp.createResponse, **swagResp.invalidResponse, **swagResp.unAuthorizedResponse, **swagResp.notPermittedResponse, **swagResp.internalErrorResponse},
        tags=['stylist'],
    )
@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def stylist_signup(request):
    """
    Signup a stylist in the system.
    """
    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'POST':
        try:
            httpResp = user_signup(request, role=User.STYLIST)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return httpResp


@swagger_auto_schema(
        methods=['POST'],
        request_body=UserSerializer,
        responses={**swagResp.createResponse, **swagResp.invalidResponse, **swagResp.unAuthorizedResponse, **swagResp.notPermittedResponse, **swagResp.internalErrorResponse},
        tags=['manager'],
    )
@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def manager_signup(request):
    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'POST':
        try:
            httpResp = user_signup(request, role=User.MANAGER)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return httpResp


@swagger_auto_schema(
        methods=['POST'],
        request_body=UserSerializer,
        responses={**swagResp.createResponse, **swagResp.invalidResponse, **swagResp.unAuthorizedResponse, **swagResp.notPermittedResponse, **swagResp.internalErrorResponse},
        tags=['customer'],
    )
@api_view(['POST'])
def customer_signup(request):
    if request.method == 'POST':
        try:
            httpResp = user_signup(request, role=User.CUSTOMER)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return httpResp


@swagger_auto_schema(
        methods=['get'],
        responses={**swagResp.getResponse(UserSerializer), **swagResp.unAuthorizedResponse, **swagResp.notPermittedResponse, **swagResp.internalErrorResponse},
        tags=['stylist'],
    )
@api_view(['GET', ])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def stylist_list(request):
    """
    Return a list of all stylists in the system.
    """
    if not (Permissions.has_manager_permission(request) or Permissions.has_client_permission(request)):
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        stylists = User.objects.filter(role=User.STYLIST)
        serializer = UserSerializer(stylists, many=True)
        return Response(serializer.data)


@swagger_auto_schema(
        methods=['GET'],
        responses={**swagResp.getResponse(UserSerializer), **swagResp.unAuthorizedResponse, **swagResp.notPermittedResponse, **swagResp.internalErrorResponse},
        tags=['customer'],
    )
@api_view(['GET', ])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def customer_list(request):
    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        customers = User.objects.filter(role=User.CUSTOMER)
        serializer = UserSerializer(customers, many=True)
        return Response(serializer.data)


@swagger_auto_schema(
        methods=['GET'],
        responses={**swagResp.getResponse(UserSerializer), **swagResp.unAuthorizedResponse, **swagResp.notPermittedResponse, **swagResp.internalErrorResponse},
        tags=['manager'],
    )
@api_view(['GET', ])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def manager_list(request):
    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        manager = User.objects.filter(role=User.MANAGER)
        serializer = UserSerializer(manager, many=True)
        return Response(serializer.data)


@swagger_auto_schema(
        methods=['PUT'],
        request_body=UserSerializer,
        responses=swagResp.commonResponses,
        tags=['stylist'],
    )
@swagger_auto_schema(
        methods=['GET', 'DELETE'],
        responses=swagResp.commonResponses,
    )
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def stylist_view(request, pk):
    try:
        stylist = User.objects.get(pk=pk, role=User.STYLIST)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        if not Permissions.has_manager_permission(request):
            # TODO: Give permission to the Stylist that is being access.
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(stylist)
        return Response(serializer.data)
    elif request.method == 'PUT':
        if not Permissions.has_manager_permission(request):
            # TODO: Give permission to the Stylist that is being access.
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(stylist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        if not Permissions.has_manager_permission(request):
            return Response(status=status.HTTP_403_FORBIDDEN)
        stylist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def index(request):
    return HttpResponse("Welcome to Express Cuts")
