from django.contrib import admin
from .models import User, Stylist, Customer, Service, Reservation, TimeSlot
from django.contrib import admin
# Register your models here.


@admin.register(Stylist)
class StylistAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'profile_details',)


@admin.register(Customer)
class Client(admin.ModelAdmin):
    list_display = ('first_name', 'last_name',)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'stylist', 'client', 'timestamp', )


admin.site.register(Service)
admin.site.register(TimeSlot)
