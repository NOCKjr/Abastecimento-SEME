from django.contrib import admin
from django.urls import path, include
from .views import home, hello

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('hello/', hello),
    path("api/", include("apps.abastecimento.urls")),

]