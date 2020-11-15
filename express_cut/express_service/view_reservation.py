import datetime

from .models import User, Reservation, Service
from .serializers import ReservationSerializer, DurationSerializer, EstimateSerializer, AnotherReservationSerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import Permissions, ReservationPermissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from .swagger_models import SwagResponses as swagResp
from .swagger_models import SwagParmDef
from .utils import calculate_estimated_wait_time


@swagger_auto_schema(methods=['PUT'], request_body=ReservationSerializer,
                     responses={**swagResp.commonResponses, **swagResp.getResponse(ReservationSerializer)}, 
                     tags=['reservation'], operation_summary="Update an Express Cuts Reservation")
@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(ReservationSerializer)},
                     tags=['reservation'], operation_summary="Get an Express Cuts Reservation")
@swagger_auto_schema(methods=['DELETE'], responses={**swagResp.commonResponses, **swagResp.getResponse(ReservationSerializer)},
                     tags=['reservation'], operation_summary="Delete an Express Cuts Reservation")
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def reservation_views(request, pk):
    try:
        obj = Reservation.objects.get(pk=pk)
    except Reservation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'PUT':
        if not ReservationPermissions().PUT_permissions(request, obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ReservationSerializer(obj, data=request.data)
        if serializer.is_valid():
            endTime = (datetime.datetime.combine(datetime.date.today(),
                                                 serializer.validated_data['startTime']) +
                       calculate_estimated_wait_time(serializer.initial_data['service'],
                                                     serializer.validated_data['stylist'])).time()
            serializer.validated_data['endTime'] = endTime
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        if not ReservationPermissions().GET_permissions(request, obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ReservationSerializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        if not ReservationPermissions().DELETE_permissions(request, obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        obj.delete()
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['POST'], request_body=ReservationSerializer, responses=swagResp.commonPOSTResponses,
                     tags=['reservation'], operation_summary="Create an Express Cuts Reservation")
@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses, **swagResp.getResponse(ReservationSerializer)},
                     tags=['reservation'], operation_summary="Get an Express Cuts Reservation")
@api_view(['POST', 'GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def reservation_general(request):
    if request.method == 'POST':
        if not ReservationPermissions().POST_permissions(request, request.data):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            endTime = (datetime.datetime.combine(datetime.date.today(),
                                                 serializer.validated_data['startTime']) +
                       calculate_estimated_wait_time(serializer.initial_data['service'],
                                                     serializer.validated_data['stylist'])).time()
            serializer.validated_data['endTime'] = endTime
            reservation = serializer.save()
            return Response(data={'id': reservation.pk}, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        if not Permissions.has_manager_permission(request):
            return Response(status=status.HTTP_403_FORBIDDEN)
        reservation = Reservation.objects.all()
        serializer = ReservationSerializer(reservation, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses,
                                                           **swagResp.getResponse(ReservationSerializer)},
                     tags=['stylist'], manual_parameters=[SwagParmDef.reservation_status], operation_summary="Get all Reservations on a Stylist by Status")
@api_view(['GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def reservations_by_stylist(request, stylist_id):
    if request.method == 'GET':
        try:
            stylist = User.objects.get(pk=stylist_id, role=User.STYLIST)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not ReservationPermissions().GET_all_by_stylist(request, stylist):
            return Response(status=status.HTTP_403_FORBIDDEN)
        query_status = request.query_params.get('status', None)
        reservations = stylist.stylist_reservations.all()
        if query_status:
            reservations = reservations.filter(status=query_status)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['DELETE'],
                     responses={**swagResp.commonResponses,}, tags=['reservation'], operation_summary="Cancel an Express Cuts Reservation")
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def cancel_reservation(request, pk):
    if request.method == 'DELETE':
        try:
            obj = Reservation.objects.get(pk=pk)
        except Reservation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not ReservationPermissions().CANCEL_permissions(request, obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        if obj.status == Reservation.PENDING or obj.status == Reservation.IN_PROCESS:
            obj.status = Reservation.CANCELLED
            obj.save()
            return Response({"message": "Reservation Successfully Canceled"}, status=status.HTTP_200_OK)
        return Response({"Error": "Unable to cancel reservation with status %s" % dict(Reservation.STATUS)[obj.status]},
                        status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['PUT'], request_body=EstimateSerializer,
                     responses={**swagResp.commonResponses, **swagResp.getResponse(EstimateSerializer)},
                     tags=['reservation'], operation_summary="Calculate Estimated Service Duration")
@api_view(['PUT'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def estimate_reservation_time(request):
    if request.method == 'PUT':
        serializer = EstimateSerializer(data=request.data)
        if serializer.is_valid():
            estimate = calculate_estimated_wait_time(serializer.initial_data['services'],
                                                     serializer.validated_data['stylist'])
            return Response({"time_estimate": str(estimate)}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
      
@swagger_auto_schema(methods=['PUT'], request_body=DurationSerializer, responses=swagResp.commonPOSTResponses,
                     tags=['reservation'], operation_summary="Completes reservation and updates service(s) duration.")
@api_view(['PUT'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def complete_reservation(request, reservation_id):
    if request.method == 'PUT':
        try:
            obj = Reservation.objects.get(pk=reservation_id)
        except Reservation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not ReservationPermissions().duration_permissions(request, obj):
            return Response(status=status.HTTP_403_FORBIDDEN)
        data = request.data
        serializer = DurationSerializer(obj, data=data, many=True)
        if serializer.is_valid():
            serializer.save()
            obj.status = Reservation.DONE
            obj.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses,
                                                           **swagResp.getResponse(AnotherReservationSerializer)},
                     tags=['stylist'], operation_summary="Get pending and in process reserved slots for a Stylist on current day.")
@api_view(['GET'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_daily_reservations(request, stylist_id):
    if request.method == 'GET':
        try:
            stylist = User.objects.get(pk=stylist_id, role=User.STYLIST)
        except User.DoesNotExist:
            return Response({"mesage":"Stylist with ID=%d not found." %stylist_id}, status=status.HTTP_404_NOT_FOUND)
        if not ReservationPermissions().GET_stylist_reservation_today_permissions(request):
            return Response(status=status.HTTP_403_FORBIDDEN)
        reservations = Reservation.objects.filter(stylist=stylist_id, date=datetime.date.today(),
                                                  status__in=[Reservation.PENDING, Reservation.IN_PROCESS])
        if reservations:
            serializer = AnotherReservationSerializer(reservations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Stylist with ID=%d does not have reservations for today." %stylist_id},
                            status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['PUT'], responses=swagResp.commonPOSTResponses,
                     tags=['reservation'], operation_summary="Start the process of a reservation.")
@api_view(['PUT'])
@authentication_classes([JSONWebTokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def start_reservation(request, reservation_id):
    if request.method == 'PUT':
        try:
            reservation = Reservation.objects.get(pk=reservation_id)
        except Reservation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not ReservationPermissions().duration_permissions(request, reservation):
            return Response(status=status.HTTP_403_FORBIDDEN)
        if reservation.status == Reservation.PENDING:
            reservation.status = Reservation.IN_PROCESS
            reservation.save()
            return Response(status=status.HTTP_200_OK)
        return Response({"error": "Unable to start processing a reservation with status %s"
                                  % dict(Reservation.STATUS)[reservation.status]}, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
