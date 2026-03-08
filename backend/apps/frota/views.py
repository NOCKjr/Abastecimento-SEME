from rest_framework.viewsets import ModelViewSet
from .models import Condutor, Veiculo
from .serializers import VeiculoSerializer, CondutorSerializer


class VeiculoViewSet(ModelViewSet):
    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        secretaria = self.request.query_params.get("secretaria")
        if secretaria:
            queryset = queryset.filter(secretaria_id=secretaria)
        return queryset


class CondutorViewSet(ModelViewSet):
    queryset = Condutor.objects.all()
    serializer_class = CondutorSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        secretaria = self.request.query_params.get("secretaria")
        if secretaria:
            queryset = queryset.filter(secretaria_id=secretaria)
        return queryset
