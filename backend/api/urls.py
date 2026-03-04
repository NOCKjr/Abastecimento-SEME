from django.contrib import admin
from django.urls import path, include
from .views import home, hello

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('hello/', hello),

    # APIs organizadas por domínio
    path('api/usuarios/', include('apps.usuarios.urls')),
    path('api/cadastros/', include('apps.cadastros.urls')),
    path('api/frota/', include('apps.frota.urls')),
    path('api/abastecimento/', include('apps.abastecimento.urls')),
]