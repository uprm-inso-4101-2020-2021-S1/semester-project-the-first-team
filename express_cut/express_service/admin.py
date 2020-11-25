from django.contrib import admin
from .models import User, Service, StylistOfferServices, DailySchedule, Reservation, Notification, \
    ReservationContainsServices, TimeSlot
from django.contrib import admin


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'role')
    list_filter = ('role', )
    exclude = ('groups', 'user_permissions')


class TimeSlotInline(admin.TabularInline):
    model = TimeSlot
    extra = 1


@admin.register(DailySchedule)
class DailyScheduleAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'stylist',)
    list_filter = ('date', )
    inlines = (TimeSlotInline,)


class ReservationServicesInline(admin.TabularInline):
    model = ReservationContainsServices
    extra = 1


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'stylist', 'customer', 'date', 'startTime', 'endTime', 'status')
    inlines = (ReservationServicesInline,)
    list_filter = ('status', 'date', )


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('serviceName', 'defaultDuration', 'description', )
