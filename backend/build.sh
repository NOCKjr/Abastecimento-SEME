#!/usr/bin/env bash

pip install -r requirements.txt

python manage.py shell << END
from django.db import connection
cursor = connection.cursor()
cursor.execute("DROP SCHEMA public CASCADE;")
cursor.execute("CREATE SCHEMA public;")
END

python manage.py migrate
python manage.py collectstatic --noinput