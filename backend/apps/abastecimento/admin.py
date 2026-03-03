from django.contrib import admin
from .models import Abastecimento

@admin.register(Abastecimento)
class AbastecimentoAdmin(admin.ModelAdmin):
    list_display = ("veiculo", "litros", "data")
    search_fields = ("veiculo", "data", )