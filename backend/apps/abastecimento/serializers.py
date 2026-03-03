from rest_framework import serializers
from .models import Abastecimento

class AbastecimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abastecimento
        fields = "__all__"