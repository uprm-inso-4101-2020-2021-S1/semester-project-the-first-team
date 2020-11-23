# Parameters go here
# Query params
# Path params

# Responses go here
from typing import List

from coreschema import String, Integer
from drf_yasg import openapi
from rest_framework.schemas import AutoSchema, coreapi


class SwagResponses:
    createResponse = {201: 'Successfully created.'}

    @staticmethod
    def getResponse(serializer):
        return {200: serializer}
    invalidResponse = {400: "Invalid request."}
    unAuthorizedResponse = {401: "Unauthorized access."}
    notPermittedResponse = {403: "No permission to access."}
    missingResponse = {404: "Object not found."}
    internalErrorResponse = {500: "Internal server error occurred."}
    validResponse = {200: "Successful request."}

    # Apply for GET, PUT, DELETE methods
    commonResponses = {**invalidResponse, **unAuthorizedResponse, **notPermittedResponse, **missingResponse,
                       **internalErrorResponse}

    commonPOSTResponses = {**createResponse, **invalidResponse, **unAuthorizedResponse, **notPermittedResponse,
                           **internalErrorResponse}


class SwagParmDef:
    reservation_status = openapi.Parameter('status', openapi.IN_QUERY, description="Status of the reservation",
                                           type=openapi.TYPE_STRING)
    schedule_start_date = openapi.Parameter('start_date', openapi.IN_QUERY,
                                            description="Date of the youngest schedule possible.",
                                            type=openapi.FORMAT_DATE)
    schedule_end_date = openapi.Parameter('end_date', openapi.IN_QUERY,
                                          description="Date of the oldest schedule possible.", type=openapi.FORMAT_DATE)
    reservation_start_date = openapi.Parameter('start_date', openapi.IN_QUERY,
                                            description="Date of the youngest reservation wanted.",
                                            type=openapi.FORMAT_DATE)
    reservation_end_date = openapi.Parameter('end_date', openapi.IN_QUERY,
                                          description="Date of the oldest reservation wanted.", type=openapi.FORMAT_DATE)


# class AvailableSlotSchema(AutoSchema):
#     def __init__(self):
#         super(AutoSchema, self).__init__()
#
#     def get_manual_fields(self, path, method):
#         extra_fields = [
#             coreapi.Field('stylist', required=True, location='form', schema=String(), description='Stylist Id', type=Integer,
#                           example='3'),
#             coreapi.Field('services', required=True, location='form', schema=String(), description="List of Service's Ids"
#                                                                                             ,
#                                         type='', example='[1,2]')
#         ]
#         manual_fields = super().get_manual_fields(path, method)
#         return manual_fields + extra_fields