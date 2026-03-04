from rest_framework.viewsets import ModelViewSet
from .models import Secretaria, Rota, Instituicao
from .serializers import SecretariaSerializer, RotaSerializer, InstituicaoSerializer


class SecretariaViewSet(ModelViewSet):
    queryset = Secretaria.objects.all()
    serializer_class = SecretariaSerializer


class RotaViewSet(ModelViewSet):
    queryset = Rota.objects.all()
    serializer_class = RotaSerializer


class InstituicaoViewSet(ModelViewSet):
    queryset = Instituicao.objects.all()
    serializer_class = InstituicaoSerializer