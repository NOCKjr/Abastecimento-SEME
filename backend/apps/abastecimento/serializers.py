from rest_framework import serializers
from .models import GuiaAbastecimento

class GuiaAbastecimentoSerializer(serializers.ModelSerializer):
    condutor_nome = serializers.CharField(
        source="condutor.nome_completo",
        read_only=True
    )

    veiculo_placa = serializers.CharField(
        source="veiculo.placa",
        read_only=True
    )

    instituicao_nome = serializers.CharField(
        source="instituicao.nome",
        read_only=True
    )
    
    class Meta:
        model = GuiaAbastecimento
        fields = "__all__"
        extra_kwargs = {
            "usuario": {"read_only": True},
        }
        
    # Quando o frontend consultar os dados, o DRF vai "expandir" as chaves estrangeiras
    def to_representation(self, instance):
        response = super().to_representation(instance)
        # Trazendo dados aninhados legíveis em vez de apenas IDs
        response['condutor_nome'] = instance.condutor.nome_completo if instance.condutor else None
        response['veiculo_placa'] = instance.veiculo.placa if instance.veiculo else None
        response['secretaria_sigla'] = instance.secretaria.sigla if instance.secretaria else None
        response['instituicao_nome'] = instance.instituicao.nome if instance.instituicao else None
        usuario_nome = instance.usuario.get_full_name().strip() if instance.usuario else None
        response['usuario_nome'] = usuario_nome if usuario_nome else (instance.usuario.cpf if instance.usuario else None)
        return response
