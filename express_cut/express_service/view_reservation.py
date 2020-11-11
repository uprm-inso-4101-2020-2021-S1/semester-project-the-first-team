from .models import User, Reservation
from .serializers import  ReservationSerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import Permissions, ReservationPermissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from .swagger_models import SwagResponses as swagResp
from .swagger_models import SwagParmDef


@swagger_auto_schema(methods=['PUT'], request_body=ReservationSerializer,
                     responses={**swagResp.commonResponses, **swagResp.getResponse(ReservationSerializer)}, tags=['reservation'], )
@swagger_auto_schema(methods=['GET', 'DELETE'], responses={**swagResp.commonResponses, **swagResp.getResponse(ReservationSerializer)},)
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
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
            serializer.save() #TODO: Handle if this fails
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
                     tags=['reservation'], )
@swagger_auto_schema(methods=['GET'], responses={**swagResp.commonResponses,
                                                           **swagResp.getResponse(ReservationSerializer)},)
@api_view(['POST', 'GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def reservation_general(request):
    if request.method == 'POST':
        if not ReservationPermissions().POST_permissions(request, request.data):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
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
                     tags=['reservation'], manual_parameters=[SwagParmDef.reservation_status])
@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
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
                     responses={**swagResp.commonResponses,}, tags=['reservation'], )
@authentication_classes([SessionAuthentication, BasicAuthentication])
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