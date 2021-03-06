from .models import User


class Permissions:

    @staticmethod
    def has_stylist_permission(request):
        if request.user.role == User.STYLIST:
            return True
        return False

    @staticmethod
    def has_customer_permission(request):
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
        elif obj.role == User.STYLIST and (self.has_manager_permission(request) or self.has_customer_permission(request)):
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
    # TODO: Check permissions for GET single obj

    def GET_all_by_stylist_permissions(self, request, stylist):
        if request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif request.user.is_authenticated and self.has_stylist_permission(request) and stylist.pk == request.user.pk:
            return True
        return False

    def GET_all_permissions(self, request):
        return request.user.is_authenticated and self.has_manager_permission(request)


class ReservationPermissions(Permissions):
    def POST_permissions(self, request, data):
        if request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif request.user.is_authenticated and self.has_customer_permission(request) and data.get('customer') == request.user.pk:
            return True
        return False

    def GET_permissions(self, request, obj):
        if request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif request.user.is_authenticated and self.has_customer_permission(request) and request.user.pk == obj.customer.pk:
            return True
        elif request.user.is_authenticated and self.has_stylist_permission(request) and request.user.pk == obj.stylist.pk:
            return True
        return False

    def PUT_permissions(self, request, obj):
        if request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif request.user.is_authenticated and self.has_customer_permission(request) and obj.customer.pk == request.user.pk:
            return True
        return False

    def DELETE_permissions(self, request, obj):
        return self.has_manager_permission(request)

    def GET_all_by_stylist(self, request, stylist_id):
        if request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif request.user.is_authenticated and self.has_stylist_permission(request) and request.user.pk == stylist_id.pk:
            return True
        return False

    def GET_all_by_customer(self, request, customer_id):
        if request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif request.user.is_authenticated and self.has_customer_permission(request) and request.user.pk == customer_id:
            return True
        return False

    def CANCEL_permissions(self, request, obj):
        if request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif request.user.is_authenticated and self.has_customer_permission(request) and \
                request.user.pk == obj.customer.pk:
            return True
        return False

    def GET_stylist_reservation_today_permissions(self, request):
        if request.user.is_authenticated:
            return True
        return False


    def duration_permissions(self, request, reservation):
        if request.user.is_authenticated and self.has_manager_permission(request): #TODO: Remove permissions for manager.
            return True
        if request.user.is_authenticated and self.has_stylist_permission(request) and request.user.pk == reservation.stylist.pk:
            return True
        return False

    def START_permissions(self, request, obj):
        if request.user.is_authenticated and self.has_manager_permission(request): # TODO: Remove permissions for manager.
            return True
        elif request.user.is_authenticated and self.has_stylist_permission(request) and \
                request.user.pk == obj.stylist.pk:
            return True
        return False

class FeedbackPermissions(Permissions):

    def POST_permissions(self, request, obj):
        if request.user.is_authenticated and self.has_customer_permission(request) and request.user.pk == obj.customer.pk:
            return True
        return False

    def GET_permissions(self, request, obj):
        if request.user.is_authenticated and self.has_customer_permission(request) and request.user.pk == obj.customer.pk:
            return True
        elif request.user.is_authenticated and self.has_manager_permission(request):
            return True
        elif request.user.is_authenticated and self.has_stylist_permission(request) and request.user.pk == obj.stylist.pk:
            return True
        return False


class CustomerViewPermissions(Permissions):

    def GET_permissions(self, request, obj):
        if request.user.is_authenticated and self.has_customer_permission(request) and request.user.pk == obj.pk:
            return True
        if request.user.is_authenticated and self.has_manager_permission(request):
            return True
        if request.user.is_authenticated and self.has_stylist_permission(request):
            return True
        return False
