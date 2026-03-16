import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
os.environ.setdefault("DJANGO_PROFILE", "dev")

application = get_asgi_application()
