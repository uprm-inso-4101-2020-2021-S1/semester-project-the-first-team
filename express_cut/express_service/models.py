from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    MANAGER = 0
    STYLIST = 1
    CUSTOMER = 2
    ADMIN = 3

    ROLE_CHOICES = (
        (MANAGER, 'Manager'),
        (STYLIST, 'Stylist'),
        (CUSTOMER, 'Customer'),
        (ADMIN, 'Admin'),
    )

    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=CUSTOMER)


class Stylist(User):
    available = models.BooleanField()
    profile_details = models.CharField(max_length=200)


class Customer(User):
    prefer_stylist = models.ForeignKey(Stylist, on_delete=models.CASCADE)


class Service(models.Model):
    name = models.CharField(max_length=50)
    avgDuration = models.IntegerField()
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class DailySchedule(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    stylist = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': User.STYLIST},)


class TimeSlot(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    dailySchedule = models.ForeignKey(DailySchedule, on_delete=models.CASCADE)
    # TODO: Add Duration


class Reservation(models.Model):
    timestamp = models.DateTimeField()
    client = models.ForeignKey(Customer, on_delete=models.CASCADE)
    stylist = models.ForeignKey(Stylist, on_delete=models.CASCADE)
    service = models.ManyToManyField(Service)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)


class Notification(models.Model):

    STATUS = [
        ('P', 'Pending'),
        ('R', 'Read'),
    ]

    message = models.CharField(max_length=100)
    timestamp = models.DateTimeField()
    status = models.CharField(max_length=1, choices=STATUS)

