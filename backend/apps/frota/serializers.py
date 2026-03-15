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
    rota_descricao = serializers.CharField(source="rota.descricao", read_only=True)
    rota_id = serializers.IntegerField(source="rota.id", read_only=True)
    secretaria_id = serializers.IntegerField(source="rota.secretaria_id", read_only=True)
    instituicao_id = serializers.IntegerField(source="rota.instituicao_id", read_only=True)

    class Meta:
        model = Lotacao
        fields = "__all__"

    def validate(self, attrs):
        condutor = attrs.get("condutor") or getattr(self.instance, "condutor", None)
        rota = attrs.get("rota") if "rota" in attrs else getattr(self.instance, "rota", None)
        veiculo = attrs.get("veiculo") if "veiculo" in attrs else getattr(self.instance, "veiculo", None)

        if self.instance is None and not rota:
            raise serializers.ValidationError({"rota": "Este campo é obrigatório."})

        if condutor and rota and rota.secretaria_id and condutor.secretaria_id != rota.secretaria_id:
            raise serializers.ValidationError({"rota": "Rota deve ser da mesma secretaria do condutor."})

        if veiculo and condutor and veiculo.secretaria_id != condutor.secretaria_id:
            raise serializers.ValidationError({"veiculo": "Veículo deve ser da mesma secretaria do condutor."})

        return attrs
