#!/bin/sh
if [ "$GENERATE_TEST_DATA" = "true" ]
then 
    # Run python script to populate db with test data
    python manage.py collectstatic && python manage.py makemigrations && python manage.py migrate && python populateDb.py && gunicorn express_cut.wsgi --bind 0.0.0.0:8000
else
python manage.py collectstatic && python manage.py makemigrations && python manage.py migrate && gunicorn express_cut.wsgi --bind 0.0.0.0:8000 
fi
