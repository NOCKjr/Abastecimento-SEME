from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Secretaria, Rota, Instituicao
from .serializers import SecretariaSerializer, RotaSerializer, InstituicaoSerializer
from apps.usuarios.permissions import CadastrosPermission
from apps.frota.models import Lotacao
import datetime


class SecretariaViewSet(ModelViewSet):
    queryset = Secretaria.objects.all()
    serializer_class = SecretariaSerializer
    permission_classes = [IsAuthenticated, CadastrosPermission]


class RotaViewSet(ModelViewSet):
    queryset = Rota.objects.all()
    serializer_class = RotaSerializer
    permission_classes = [IsAuthenticated, CadastrosPermission]

    def get_queryset(self):
        queryset = super().get_queryset()

        secretaria = self.request.query_params.get("secretaria")
        if secretaria:
            queryset = queryset.filter(secretaria_id=secretaria)

        instituicao = self.request.query_params.get("instituicao")
        if instituicao:
            queryset = queryset.filter(instituicao_id=instituicao)

        ativa = self.request.query_params.get("ativa")
        if ativa is None:
            queryset = queryset.filter(ativa=True)
        elif ativa != "":
            queryset = queryset.filter(ativa=str(ativa).lower() in ("1", "true", "t", "yes", "y"))

        condutor = self.request.query_params.get("condutor")
        if condutor:
            raw_data = self.request.query_params.get("data")
            target_date = None
            if raw_data:
                try:
                    target_date = datetime.date.fromisoformat(raw_data)
                except ValueError:
                    target_date = None

            lotacoes = Lotacao.objects.filter(condutor_id=condutor, ativa=True, rota__isnull=False)
            if target_date:
                lotacoes = lotacoes.filter(data__lte=target_date)

            rota_ids = lotacoes.values_list("rota_id", flat=True).distinct()
            queryset = queryset.filter(id__in=rota_ids)

        return queryset


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
