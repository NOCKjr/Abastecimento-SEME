from django.contrib import admin
from .models import GuiaAbastecimento


@admin.register(GuiaAbastecimento)
class GuiaAbastecimentoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "data_emissao",
        "tipo_servico",
        "tipo_combustivel",
        "qtd_combustivel",
        "condutor",
        "veiculo",
        "secretaria",
    )

    list_filter = (
        "tipo_servico",
        "tipo_combustivel",
        "secretaria",
        "data_emissao",
    )

    search_fields = (
        "condutor__nome_completo",
        "veiculo__placa",
    )

    ordering = ("-data_emissao",)