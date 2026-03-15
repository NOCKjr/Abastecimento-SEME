from rest_framework import serializers
from .models import Secretaria, Rota, Instituicao


class SecretariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Secretaria
        fields = "__all__"

class RotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rota
        fields = "__all__"

    def validate(self, attrs):
        secretaria = attrs.get("secretaria") if "secretaria" in attrs else getattr(self.instance, "secretaria", None)
        instituicao = attrs.get("instituicao") if "instituicao" in attrs else getattr(self.instance, "instituicao", None)

        if self.instance is None:
            if not secretaria:
                raise serializers.ValidationError({"secretaria": "Este campo é obrigatório."})
            if not instituicao:
                raise serializers.ValidationError({"instituicao": "Este campo é obrigatório."})

        if secretaria and instituicao and instituicao.secretaria_id != secretaria.id:
            raise serializers.ValidationError({"instituicao": "Instituição deve ser da mesma secretaria da rota."})

        return attrs

class InstituicaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instituicao
        fields = "__all__"
