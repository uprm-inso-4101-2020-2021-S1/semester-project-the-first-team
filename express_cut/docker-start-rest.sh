python manage.py collectstatic && python manage.py makemigrations && python manage.py migrate

if [ "$GENERATE_TEST_DATA" = "true" ]
then 
    # Run python script to populate db with test data
    python populateDb.py
fi
gunicorn express_cut.wsgi --bind 0.0.0.0:8000 
