import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'express_cut.settings'

import django
django.setup()

from express_service.models import User, Service
from django.contrib.auth.hashers import make_password

print("Populating DB with test resources")

usr1 = User(username='Admin', first_name='John', last_name='Doe', email='john.doe@upr.edu',
                    role=User.ADMIN, password=make_password('Admin'), is_superuser=True, is_staff=True)
usr1.save()
usr2 = User(username='Manager', first_name='Jane', last_name='Doe', email='jane.doe@upr.edu',
                    role=User.MANAGER, password=make_password('Manager'), is_superuser=False)
usr2.save()
usr3 = User(username='Stylist', first_name='Tom', last_name='Smith', email='tom.smith@upr.edu',
                    role=User.STYLIST, password=make_password('Stylist'), is_superuser=False)
usr3.save()
usr4 = User(username='Customer', first_name='Jessy', last_name='Smith', email='jessy.smith@upr.edu',
                    role=User.CUSTOMER, password=make_password('Customer'), is_superuser=False)
usr4.save()

serv1 = Service(serviceName='Wash', defaultDuration=10, description='Lavado de pelo')
serv1.save()