from django.shortcuts import render
from django.http import HttpResponse
from .models import User, DailySchedule
from .serializers import GeneralUserSerializer, SingUpUserSerializer, DailyScheduleSerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import Permissions, SignUpPermissions, UserViewPermissions, DailySchedulePermissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from .swagger_models import SwagResponses as swagResp

def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': GeneralUserSerializer(user, context={'request': request}).data
    }

@swagger_auto_schema(methods=['POST'], request_body=SingUpUserSerializer, responses=swagResp.commonPOSTResponses,
                     tags=['user'], operation_summary="Sign up users for Express Cuts")
@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
def user_signup_view(request):
    """
    Signup a users in the system.
    """
    data = request.data
    serializer = SingUpUserSerializer(data=data)
    if not serializer.is_valid():
        return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    if not SignUpPermissions().POST_permissions(request, serializer.validated_data):
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'POST':
        user = serializer.save()
        return Response(data = {'id': user.pk}, status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(GeneralUserSerializer)},
                     tags=['user'], operation_summary="Get Express Cuts User by their token")
@api_view(['GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
    if request.method == 'GET':
        serializer = GeneralUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(GeneralUserSerializer)}, 
                    tags=['user'], operation_summary="Get all Users of Express Cuts")
@api_view(['GET', ])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    """
    Return a list of all users in the system.
    """
    if not Permissions.has_manager_permission(request):
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        users = User.objects.all()
        role = request.GET.get('role')
        if role == User.STYLIST:
            users.filter(role=User.STYLIST)
        elif role == User.CUSTOMER:
            users.filter(role=User.CUSTOMER)
        elif role == User.MANAGER:
            users.filter(role=User.MANAGER)
        serializer = GeneralUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(methods=['PUT'], request_body=GeneralUserSerializer, responses={**swagResp.commonResponses, **swagResp.getResponse(GeneralUserSerializer)},
                     tags=['user'], operation_summary="Update Express Cuts Users")
@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(GeneralUserSerializer)},
                     tags=['user'], operation_summary="Get Users of Express Cuts")
@swagger_auto_schema(methods=['DELETE'], responses={**swagResp.commonResponses, **swagResp.getResponse(GeneralUserSerializer)},
                     tags=['user'], operation_summary="Delete Users of Express Cuts")
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def users_views(request, pk):
    try:
        usr_obj = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if not UserViewPermissions().GET_permissions(request, usr_obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = GeneralUserSerializer(usr_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        if not UserViewPermissions().PUT_permissions(request, usr_obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = GeneralUserSerializer(usr_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if not UserViewPermissions().DELETE_permissions(request, usr_obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        usr_obj.delete()
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def index(request):
    return HttpResponse("Welcome to Express Cuts")

