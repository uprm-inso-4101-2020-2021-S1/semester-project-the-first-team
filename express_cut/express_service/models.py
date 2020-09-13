from django.db import models


class User(models.Model):
    GENDERS = [
        ('F', 'Female'),
        ('M', 'Male'),
    ]
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=30)
    email = models.EmailField()
    gender = models.CharField(max_length=1, choices=GENDERS)

    def __str__(self):
        return self.first_name + ' ' + self.last_name


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


class Schedule(models.Model):
    timestamp = models.DateTimeField()
    stylist = models.ForeignKey(Stylist, on_delete=models.CASCADE)


class TimeSlot(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
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

