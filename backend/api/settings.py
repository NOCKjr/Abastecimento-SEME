import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# ======================
# PROFILE / ENV LOADING
# ======================

DJANGO_PROFILE = os.getenv("DJANGO_PROFILE", "dev").strip().lower()
if DJANGO_PROFILE not in {"dev", "prod", "validation"}:
    DJANGO_PROFILE = "dev"

# Variáveis de ambiente
try:
    from dotenv import load_dotenv

    # Tenta carregar primeiro `.env.<profile>` e depois `.env`
    load_dotenv(BASE_DIR / f".env.{DJANGO_PROFILE}", override=False)
    load_dotenv(BASE_DIR / ".env", override=False)
except:
    pass

# ======================
# SECURITY
# ======================

SECRET_KEY = os.getenv("SECRET_KEY")

if "DEBUG" in os.environ:
    DEBUG = os.getenv("DEBUG", "False") == "True"
else:
    DEBUG = DJANGO_PROFILE == "dev"

allowed_hosts_env = os.getenv("ALLOWED_HOSTS", "").strip()
if allowed_hosts_env:
    ALLOWED_HOSTS = [h.strip() for h in allowed_hosts_env.split(",") if h.strip()]
else:
    ALLOWED_HOSTS = ["*"]

# ======================
# SECURITY (PRODUCTION)
# ======================

if not DEBUG:
    SECURE_SSL_REDIRECT = True

    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    SECURE_HSTS_SECONDS = 31536000  # 1 ano
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

# ======================
# APPS
# ======================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'apps.core.apps.CoreConfig',
    'apps.abastecimento',
    'apps.cadastros',
    'apps.frota',
    'apps.usuarios',
]

# ======================
# MIDDLEWARE
# ======================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'api.urls'

# ======================
# AUTENTICAÇÃO & AUTORIZAÇÃO
# ======================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated', # Bloqueia tudo por padrão
    ),
    'EXCEPTION_HANDLER': 'api.exception_handler.custom_exception_handler',
}

# ======================
# TEMPLATES
# ======================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'api.wsgi.application'

# ======================
# DATABASE
# ======================

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if DJANGO_PROFILE == "dev":
    if DATABASE_URL:
        DATABASES = {"default": dj_database_url.parse(DATABASE_URL, conn_max_age=0)}
    else:
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": BASE_DIR / "db.sqlite3",
            }
        }
else:
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL é obrigatório para DJANGO_PROFILE=prod/validation")

    DATABASES = {"default": dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=True)}

# ======================
# PASSWORD VALIDATION
# ======================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ======================
# INTERNATIONALIZATION
# ======================

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ======================
# STATIC FILES
# ======================

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ======================
# DEFAULT FIELD
# ======================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ======================
# CORS
# ======================

cors_allowed_origins_env = os.getenv("CORS_ALLOWED_ORIGINS", "").strip()
if cors_allowed_origins_env:
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = [o.strip() for o in cors_allowed_origins_env.split(",") if o.strip()]
else:
    CORS_ALLOW_ALL_ORIGINS = True

csrf_trusted_env = os.getenv("CSRF_TRUSTED_ORIGINS", "").strip()
if csrf_trusted_env:
    CSRF_TRUSTED_ORIGINS = [o.strip() for o in csrf_trusted_env.split(",") if o.strip()]

# ======================
# AUTH
# ======================

AUTH_USER_MODEL = 'usuarios.Usuario'

# ======================
# CACHE
# ======================

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "abastecimento-seme",
    }
}
