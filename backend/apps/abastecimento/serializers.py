from rest_framework import serializers
from .models import GuiaAbastecimento

class GuiaAbastecimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuiaAbastecimento
        fields = "__all__"
        
    # Quando o frontend consultar os dados, o DRF vai "expandir" as chaves estrangeiras
    def to_representation(self, instance):
        response = super().to_representation(instance)
        # Trazendo dados aninhados legíveis em vez de apenas IDs
        response['condutor_nome'] = instance.condutor.nome_completo if instance.condutor else None
        response['veiculo_placa'] = instance.veiculo.placa if instance.veiculo else None
        response['secretaria_sigla'] = instance.secretaria.sigla if instance.secretaria else None
        response['instituicao_nome'] = instance.instituicao.nome if instance.instituicao else None
        return response