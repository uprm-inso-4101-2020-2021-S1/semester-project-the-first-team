from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    MANAGER = 0
    STYLIST = 1
    CUSTOMER = 2
    ADMIN = 3

    ROLE_CHOICES = [
        (MANAGER, 'Manager'),
        (STYLIST, 'Stylist'),
        (CUSTOMER, 'Customer'),
        (ADMIN, 'Admin'),
    ]

    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=CUSTOMER)


class Service(models.Model):
    serviceName = models.CharField(max_length=50)
    defaultDuration = models.IntegerField()
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.serviceName


class DailySchedule(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    stylist = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': User.STYLIST},)


class TimeSlot(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    dailySchedule = models.ForeignKey(DailySchedule, on_delete=models.CASCADE, related_name='timeslots')


class StylistOfferServices(models.Model):
    EstimatedTime = models.TimeField()
    stylist = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': User.STYLIST})
    service = models.ForeignKey(Service, on_delete=models.CASCADE)


class Reservation(models.Model):
    PENDING = 'P'
    IN_PROCESS = 'IP'
    DONE = 'D'
    CANCELLED = 'C'
    STATUS = [
        ('P', 'Pending'),
        ('IP', 'In Process'),
        ('D', 'Done'),
        ('C', 'Cancelled')
    ]
    timestamp = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    startTime = models.TimeField()
    # estimatedDuration = models.IntegerField()
    endTime = models.TimeField(null=True)
    note = models.CharField(max_length=150, null=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE,  limit_choices_to={'role': User.CUSTOMER},
                                 related_name='customer_reservations')
    stylist = models.ForeignKey(User, on_delete=models.CASCADE,  limit_choices_to={'role': User.STYLIST},
                                related_name='stylist_reservations')
    service = models.ManyToManyField(Service, through='ReservationContainsServices')
    status = models.CharField(max_length=2, choices=STATUS, default=PENDING)


class Feedback(models.Model):
    rating = models.SmallIntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    comments = models.CharField(max_length=200)
    reservation = models.OneToOneField(Reservation, on_delete=models.CASCADE)


class Notification(models.Model):
    STATUS = [
        ('P', 'Pending'),
        ('S', 'Seen'),
    ]
    message = models.CharField(max_length=100)
    timestamp = models.DateTimeField()
    status = models.CharField(max_length=1, choices=STATUS)


class ReservationContainsServices(models.Model):
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    duration = models.TimeField(null=True)
