from django.contrib import admin
from .models import Veiculo, Condutor


@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display = ("id", "placa", "modelo", "ano", "tipo_combustivel", "secretaria")
    list_filter = ("tipo_combustivel", "secretaria")
    search_fields = ("placa", "modelo")


@admin.register(Condutor)
class CondutorAdmin(admin.ModelAdmin):
    list_display = ("id", "nome_completo", "cpf")
    search_fields = ("nome_completo", "cpf")