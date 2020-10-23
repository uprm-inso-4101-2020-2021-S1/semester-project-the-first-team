from django.shortcuts import render
from django.http import HttpResponse
from .models import Stylist, User
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import Permissions, SignUpPermissions, UserViewPermissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from .swagger_models import SwagResponses as swagResp


@swagger_auto_schema(methods=['POST'], request_body=UserSerializer, responses=swagResp.commonPOSTResponses,
                     tags=['user'], )
@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
def user_signup_view(request):
    """
    Signup a users in the system.
    """
    data = request.data
    serializer = UserSerializer(data=data)
    if not serializer.is_valid():
        return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    if not SignUpPermissions().POST_permissions(request, serializer.validated_data):
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'POST':
        user = serializer.save()
        return Response(data = {'pk': user.pk},status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(UserSerializer)}, tags=['user'], )
@api_view(['GET', ])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def all_users(request):
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
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


@swagger_auto_schema(methods=['PUT'], request_body=UserSerializer, responses={**swagResp.commonResponses, **swagResp.getResponse(UserSerializer)},
                     tags=['user'], )
@swagger_auto_schema(methods=['GET', 'DELETE'], responses={**swagResp.commonResponses, **swagResp.getResponse(UserSerializer)},)
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def users_views(request, pk):
    try:
        usr_obj = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if not UserViewPermissions().GET_permissions(request, usr_obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(usr_obj)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if not UserViewPermissions().PUT_permissions(request, usr_obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(usr_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if not UserViewPermissions().DELETE_permissions(request, usr_obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        usr_obj.delete()
        return Response(status=status.HTTP_200_OK)

    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @api_view(['GET','PUT', 'POST','DELETE'])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])
# def schedule_views(request, stylist_id):
#     if request.method == 'POST':
#         if not UserViewPermissions().GET_permissions(request):
#             return Response(status=status.HTTP_403_FORBIDDEN)
#         if





def index(request):
    return HttpResponse("Welcome to Express Cuts")
