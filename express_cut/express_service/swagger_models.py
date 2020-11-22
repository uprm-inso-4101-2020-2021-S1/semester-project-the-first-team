# Parameters go here
# Query params
# Path params

# Responses go here
from drf_yasg import openapi


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
