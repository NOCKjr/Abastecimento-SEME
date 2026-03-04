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

class InstituicaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instituicao
        fields = "__all__"