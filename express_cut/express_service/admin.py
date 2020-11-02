from django.contrib import admin
from .models import User, Service, StylistOfferServices, DailySchedule, Reservation, Notification
from django.contrib import admin
# Register your models here.


# @admin.register(Stylist)
# class StylistAdmin(admin.ModelAdmin):
#     list_display = ('first_name', 'last_name', 'profile_details',)
#
#
# @admin.register(Customer)
# class Client(admin.ModelAdmin):
#     list_display = ('first_name', 'last_name',)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'stylist', 'customer', 'timestamp', )


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('serviceName', 'defaultDuration', 'description', )

admin.site.register(User)
# admin.site.register()
