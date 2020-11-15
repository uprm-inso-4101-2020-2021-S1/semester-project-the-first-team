FROM python:3.8.6-alpine
ENV PYTHONUNBUFFERED 1

RUN apk update && apk add curl postgresql-dev gcc python3-dev musl-dev

# Django Variables
ENV DJANGO_ALLOWED_HOSTS "localhost 127.0.0.1"
ENV DJANGO_SECRET_KEY "mim-1fbk4#ih!%awlxv17s_a835bpc&djw0y$4@c%&h-*eovba"
ENV DJANGO_CORS_ORIGIN_WHITELIST "http://localhost http://127.0.0.1 http://localhost:3000"
ENV DEBUG false
ENV CORS_ALLOW_ALL true

# JWT default expiration time in seconds
ENV JWT_EXPIRATION_TIME 300

# Connection settings
ENV DATABASE_NAME express_cuts_db
ENV DATABASE_USER admin
ENV DATABASE_PASSWORD password
ENV DATABASE_HOST localhost
ENV DATABASE_PORT 5434

# Test variables
ENV GENERATE_TEST_DATA false

COPY . /app

# Delete previous migrations
RUN rm -rfv /app/express_service/migrations && mkdir /app/express_service/migrations && touch /app/express_service/migrations/__init__.py

RUN pip install --no-cache-dir -r /app/requirements.txt

EXPOSE 8000

WORKDIR /app/

CMD ./docker-start-rest.sh
