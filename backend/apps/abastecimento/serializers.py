from rest_framework import serializers
from .models import GuiaAbastecimento


class GuiaAbastecimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuiaAbastecimento
        fields = "__all__"