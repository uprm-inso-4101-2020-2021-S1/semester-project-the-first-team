from .models import User


class Permissions:

    @staticmethod
    def has_stylist_permission(request):
        if request.user.role == User.STYLIST:
            return True
        return False

    @staticmethod
    def has_client_permission(request):
        if request.user.role == User.CUSTOMER:
            return True
        return False

    @staticmethod
    def has_manager_permission(request):
        if request.user.role == User.MANAGER:
            return True
        return False

    @staticmethod
    def has_owner_permission(request, obj):
        # TODO: Not implemented. Check if the model to access on the request is associated with the user
        return False


class UserViewPermissions(Permissions):
    @staticmethod
    def has_owner_permission(request, obj):
        if request.user.pk == obj.pk:
            return True
        return False

    def GET_permissions(self, request, obj):
        if self.has_owner_permission(request, obj):
            return True
        elif obj.role == User.STYLIST and (self.has_manager_permission(request) or self.has_client_permission(request)):
            return True
        elif (obj.role == User.MANAGER or obj.role == User.CUSTOMER) and self.has_manager_permission(request):
            return True
        return False

    def PUT_permissions(self, request, obj):
        if self.has_owner_permission(request, obj):
            return True
        elif self.has_manager_permission(request):
            return True
        return False

    def DELETE_permissions(self, request, obj):
        if self.has_manager_permission(request):
            return True


class SignUpPermissions(Permissions):
    def POST_permissions(self, request, data):
        if data.get('role') == User.STYLIST and request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif data.get('role') == User.MANAGER and request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif data.get('role') == User.CUSTOMER and (not request.user.is_authenticated or (request.user.is_authenticated and self.has_manager_permission(request))):
            return True
        return False


class DailySchedulePermissions(Permissions):
    def POST_PUT_DELETE_permissions(self, request):
        if request.user.is_authenticated and self.has_manager_permission(request):
            return True
        return False




