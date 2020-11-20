# Express Cuts - Backend

This is the Rest API implementation for the Express Cuts project. Implemented for the Software Engineering class using Django Rest Framework and documented with OpenAPI.

## Requirements

- Python - 3.8.5
- Postgresql Database - 12+

## Environment Variables for Rest API

These are the environment variables used by the Rest API for running

| Environment Variable | Required | Description |
| ------------- | ------------- | ------------- |
| DJANGO_ALLOWED_HOSTS | true | List of IPs or domains separated by a single space which are allowed to access the Rest API. |
| DJANGO_SECRET_KEY | true | Secret key for Django Rest Framework. |
| DJANGO_CORS_ORIGIN_WHITELIST | true | List of IPs or domains separated by a single space which are allowed CORS. |
| DEBUG | false | true or false. Determins whether the Rest API should start in Django debug mode. |
| CORS_ALLOW_ALL | false | true or false. Determines whether the Rest API will enable or disable CORS. |
| JWT_EXPIRATION_TIME | true | Determines the expiration time of every token given out by the system. |
| DATABASE_NAME | true | The Postgres database name which the Rest API will connect to. |
| DATABASE_USER | true | The Postgres database user which the Rest API will use along with DATABASE_PASSWORD to connect to the database. |
| DATABASE_PASSWORD | true | The Postgres database password which the Rest API will use along with DATABASE_USER to connect to the database. |
| DATABASE_HOST | true | The host domain or ip on which the Postgres database is deployed. |
| DATABASE_PORT | true | The port on which the Postgres database is deployed. |

## Usage

- Make sure to install all the required packages by running the following
  commands while inside the express_cut directory (only required before
  running the app for the first time):

  1. `pip install -r requirements.txt`
  2. `python manage.py makemigrations`
  3. `python manage.py migrate`

* To start the server first set the variables for your deployment as listed in the *Environment Variables* section. Then run the following command while inside the express_cut directory:

    `python manage.py runserver`

* Access the Swagger-UI for the OpenAPI specification of the project by going to:

  `http://<deployment-domain>/api/swagger`
