# Parameters go here
# Query params
# Path params

# Responses go here


class SwagResponses():
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

