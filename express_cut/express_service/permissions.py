from .models import User


class Permissions:

    @staticmethod
    def has_stylist_permission(request):
        if request.user.role == User.STYLIST:
            return True
        return False

    @staticmethod
    def has_client_permission(request):
        if request.user.role == User.CLIENT:
            return True
        return False

    @staticmethod
    def has_manager_permission(request):
        if request.user.role == User.MANAGER:
            return True
        return False

    @staticmethod
    def has_owner_permission(request):
        # TODO: Not implemented. Check if the model to access on the request is associated with the user
        return False
