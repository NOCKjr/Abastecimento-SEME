from rest_framework.viewsets import ModelViewSet
from .models import Condutor, Veiculo
from .serializers import VeiculoSerializer, CondutorSerializer


class VeiculoViewSet(ModelViewSet):
    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer


class CondutorViewSet(ModelViewSet):
    queryset = Condutor.objects.all()
    serializer_class = CondutorSerializer