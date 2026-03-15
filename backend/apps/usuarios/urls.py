from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, register

router = DefaultRouter()
router.register(r'', UsuarioViewSet)

urlpatterns = [
    path("register/", register, name="usuarios_register"),
    *router.urls,
]
