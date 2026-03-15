from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Condutor, Veiculo, Lotacao
from .serializers import VeiculoSerializer, CondutorSerializer, LotacaoSerializer
from apps.usuarios.permissions import FrotaPermission
import datetime
from apps.core.viewset_cache import ModelViewSetCacheMixin


class VeiculoViewSet(ModelViewSetCacheMixin, ModelViewSet):
    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer
    permission_classes = [IsAuthenticated, FrotaPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        secretaria = self.request.query_params.get("secretaria")
        if secretaria:
            queryset = queryset.filter(secretaria_id=secretaria)
        return queryset


class CondutorViewSet(ModelViewSetCacheMixin, ModelViewSet):
    queryset = Condutor.objects.all()
    serializer_class = CondutorSerializer
    permission_classes = [IsAuthenticated, FrotaPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        secretaria = self.request.query_params.get("secretaria")
        if secretaria:
            queryset = queryset.filter(secretaria_id=secretaria)

        ativo = self.request.query_params.get("ativo")
        if ativo is None:
            queryset = queryset.filter(ativo=True)
        elif ativo != "":
            queryset = queryset.filter(ativo=str(ativo).lower() in ("1", "true", "t", "yes", "y"))
        return queryset

    @action(detail=True, methods=["get"], url_path="lotacao-atual")
    def lotacao_atual(self, request, pk=None):
        condutor = self.get_object()

        raw_data = request.query_params.get("data")
        target_date = None
        if raw_data:
            try:
                target_date = datetime.date.fromisoformat(raw_data)
            except ValueError:
                return Response(
                    {"detail": "Parâmetro 'data' inválido. Use YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            target_date = datetime.date.today()

        lotacao = (
            Lotacao.objects.filter(
                condutor=condutor,
                data__lte=target_date,
                ativa=True,
                rota__isnull=False,
                rota__ativa=True,
            )
            .order_by("-data", "-id")
            .first()
        )

        if not lotacao:
            return Response({"lotacao": None})

        return Response({"lotacao": LotacaoSerializer(lotacao).data})


class LotacaoViewSet(ModelViewSetCacheMixin, ModelViewSet):
    queryset = Lotacao.objects.all()
    serializer_class = LotacaoSerializer
    permission_classes = [IsAuthenticated, FrotaPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        condutor = self.request.query_params.get("condutor")
        if condutor:
            queryset = queryset.filter(condutor_id=condutor)

        rota = self.request.query_params.get("rota")
        if rota:
            queryset = queryset.filter(rota_id=rota)

        ativa = self.request.query_params.get("ativa")
        if ativa is None:
            queryset = queryset.filter(ativa=True)
        elif ativa != "":
            queryset = queryset.filter(ativa=str(ativa).lower() in ("1", "true", "t", "yes", "y"))

        raw_data = self.request.query_params.get("data")
        if raw_data:
            try:
                target_date = datetime.date.fromisoformat(raw_data)
            except ValueError:
                return queryset.none()
            queryset = queryset.filter(data__lte=target_date).order_by("-data", "-id")

        return queryset
