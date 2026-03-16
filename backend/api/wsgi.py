import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
os.environ.setdefault("DJANGO_PROFILE", "dev")

application = get_wsgi_application()
