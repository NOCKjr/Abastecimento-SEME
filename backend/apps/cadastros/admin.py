from django.contrib import admin
from .models import Secretaria, Rota, Instituicao


@admin.register(Secretaria)
class SecretariaAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "sigla")
    search_fields = ("nome", "sigla")


@admin.register(Rota)
class RotaAdmin(admin.ModelAdmin):
    list_display = ("id", "descricao", "secretaria", "instituicao", "ativa")
    list_filter = ("secretaria", "ativa")
    search_fields = ("descricao", "detalhes")


@admin.register(Instituicao)
class InstituicaoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "tipo", "secretaria")
    list_filter = ("secretaria", "tipo")
    search_fields = ("nome",)
