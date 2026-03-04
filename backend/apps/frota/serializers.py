from rest_framework import serializers
from .models import Veiculo, Condutor


class VeiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veiculo
        fields = "__all__"

class CondutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condutor
        fields = "__all__"