from django.contrib import admin
from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "first_name", "last_name", "cpf", "is_active")
    search_fields = ("username", "first_name", "last_name", "cpf")
