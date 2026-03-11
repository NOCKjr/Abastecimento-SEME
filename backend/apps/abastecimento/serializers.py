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
        fields = [
            "id",
            "data_emissao",
            "tipo_servico",
            "tipo_combustivel",
            "qtd_combustivel",
            "qtd_oleo_lubrificante",
            "hodometro",
            "observacao",

            "condutor",
            "instituicao",
            "rota",
            "secretaria",
            "usuario",
            "veiculo",

            "condutor_nome",
            "veiculo_placa",
            "instituicao_nome",
        ]