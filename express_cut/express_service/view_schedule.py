import re

from django.shortcuts import render
from django.http import HttpResponse
from .models import User, DailySchedule
from .serializers import DailyScheduleSerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import DailySchedulePermissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from .swagger_models import SwagResponses as swagResp
from .swagger_models import SwagParmDef
from rest_framework.exceptions import ValidationError


@swagger_auto_schema(methods=['GET'],
                     responses={**swagResp.commonResponses, **swagResp.getResponse(DailyScheduleSerializer)},
                     tags=['dailySchedule'], manual_parameters=[SwagParmDef.schedule_start_date,
                                                                SwagParmDef.schedule_end_date],
                     operation_summary="Get all schedules, filtered by date range.")
@swagger_auto_schema(methods=['POST'], request_body=DailyScheduleSerializer, responses=swagResp.commonPOSTResponses,
                     tags=['dailySchedule'], operation_summary="Create an Express Cuts Schedule")
@api_view(['POST', 'GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def schedule_views(request):
    if request.method == 'POST':
        data = request.data
        serializer = DailyScheduleSerializer(data=data)
        # Checks if the user logged in is a manager & if it's logged in.
        if not DailySchedulePermissions().POST_PUT_DELETE_permissions(request):
            return Response(status=status.HTTP_403_FORBIDDEN)
        # Checks if you have both a date and a stylist id.
        if not serializer.is_valid():
            return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        try:
            schedule = serializer.save()
            return Response(data={"id": schedule.pk}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'GET':
        if not DailySchedulePermissions().GET_all_permissions(request):
            return Response(status=status.HTTP_403_FORBIDDEN)
        schedules = DailySchedule.objects.all()
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        if start_date and re.match(r"^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$", start_date):
            schedules = schedules.filter(date__gte=start_date)
        if end_date and re.match(r"^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$", end_date):
            schedules = schedules.filter(date__lte=end_date)
        serializer = DailyScheduleSerializer(schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(DailyScheduleSerializer)},
                     tags=['dailySchedule'], operation_summary="Get an Express Cuts Schedule")
@swagger_auto_schema(methods=['DELETE'], responses={**swagResp.commonResponses, **swagResp.getResponse(DailyScheduleSerializer)},
                     tags=['dailySchedule'], operation_summary="Delete an Express Cuts Schedule")
@swagger_auto_schema(methods=['PUT'], request_body=DailyScheduleSerializer, responses={**swagResp.commonResponses,  **swagResp.getResponse(DailyScheduleSerializer)},
                     tags=['dailySchedule'], operation_summary="Update an Express Cuts Schedule")
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def schedule_views_put(request, pk):
    try:
        schedule = DailySchedule.objects.get(pk=pk)
    except DailySchedule.DoesNotExist:
        return Response({'message': 'The daily schedule does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DailyScheduleSerializer(schedule)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        if not DailySchedulePermissions().POST_PUT_DELETE_permissions(request):
            return Response(status=status.HTTP_403_FORBIDDEN)
        data = request.data
        serializer = DailyScheduleSerializer(schedule, data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if not DailySchedulePermissions().POST_PUT_DELETE_permissions(request):
            return Response(status=status.HTTP_403_FORBIDDEN)
        schedule.delete()
        return Response({'message': 'Daily Schedule was deleted successfully.'}, status.HTTP_200_OK)

    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'],
                     responses={**swagResp.commonResponses, **swagResp.getResponse(DailyScheduleSerializer)},
                     tags=['stylist'], manual_parameters=[SwagParmDef.schedule_start_date,
                                                                SwagParmDef.schedule_end_date],
                     operation_summary="Get all schedules of a stylist, filtered by date range.")
@api_view(['GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_all_schedule_by_stylist(request, stylist_id):
    if request.method == 'GET':
        try:
            stylist = User.objects.get(pk=stylist_id, role=User.STYLIST)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not DailySchedulePermissions().GET_all_by_stylist_permissions(request, stylist):
            return Response(status=status.HTTP_403_FORBIDDEN)
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        schedules = stylist.dailyschedule_set.all()
        if start_date and re.match(r"^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$", start_date):
            schedules = schedules.filter(date__gte=start_date)
        if end_date and re.match(r"^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$", end_date):
            schedules = schedules.filter(date__lte=end_date)
        serializer = DailyScheduleSerializer(schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)