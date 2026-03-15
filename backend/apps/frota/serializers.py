from rest_framework import serializers
from .models import Veiculo, Condutor, Lotacao


class VeiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veiculo
        fields = "__all__"

class CondutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condutor
        fields = "__all__"


class LotacaoSerializer(serializers.ModelSerializer):
    condutor_nome = serializers.CharField(source="condutor.nome_completo", read_only=True)
    veiculo_placa = serializers.CharField(source="veiculo.placa", read_only=True)
    instituicao_nome = serializers.CharField(source="instituicao.nome", read_only=True)
    secretaria_sigla = serializers.CharField(source="secretaria.sigla", read_only=True)
    rota_descricao = serializers.CharField(source="rota.descricao", read_only=True)

    class Meta:
        model = Lotacao
        fields = "__all__"

    def validate(self, attrs):
        condutor = attrs.get("condutor") or getattr(self.instance, "condutor", None)
        secretaria = attrs.get("secretaria") or getattr(self.instance, "secretaria", None)
        veiculo = attrs.get("veiculo") if "veiculo" in attrs else getattr(self.instance, "veiculo", None)
        instituicao = attrs.get("instituicao") if "instituicao" in attrs else getattr(self.instance, "instituicao", None)

        if condutor and secretaria and condutor.secretaria_id != secretaria.id:
            raise serializers.ValidationError({"secretaria": "Secretaria deve ser a mesma do condutor."})

        if veiculo and secretaria and veiculo.secretaria_id != secretaria.id:
            raise serializers.ValidationError({"veiculo": "Veículo deve ser da mesma secretaria da lotação."})

        if instituicao and secretaria and instituicao.secretaria_id != secretaria.id:
            raise serializers.ValidationError({"instituicao": "Instituição deve ser da mesma secretaria da lotação."})

        return attrs
