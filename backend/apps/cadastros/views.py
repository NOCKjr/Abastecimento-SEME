from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Secretaria, Rota, Instituicao
from .serializers import SecretariaSerializer, RotaSerializer, InstituicaoSerializer
from apps.usuarios.permissions import CadastrosPermission


class SecretariaViewSet(ModelViewSet):
    queryset = Secretaria.objects.all()
    serializer_class = SecretariaSerializer
    permission_classes = [IsAuthenticated, CadastrosPermission]


class RotaViewSet(ModelViewSet):
    queryset = Rota.objects.all()
    serializer_class = RotaSerializer
    permission_classes = [IsAuthenticated, CadastrosPermission]


class InstituicaoViewSet(ModelViewSet):
    queryset = Instituicao.objects.all()
    serializer_class = InstituicaoSerializer
    permission_classes = [IsAuthenticated, CadastrosPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        secretaria = self.request.query_params.get("secretaria")
        if secretaria:
            queryset = queryset.filter(secretaria_id=secretaria)
        return queryset
