from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Condutor, Veiculo, Lotacao
from .serializers import VeiculoSerializer, CondutorSerializer, LotacaoSerializer
from apps.usuarios.permissions import FrotaPermission
import datetime


class VeiculoViewSet(ModelViewSet):
    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer
    permission_classes = [IsAuthenticated, FrotaPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        secretaria = self.request.query_params.get("secretaria")
        if secretaria:
            queryset = queryset.filter(secretaria_id=secretaria)
        return queryset


class CondutorViewSet(ModelViewSet):
    queryset = Condutor.objects.all()
    serializer_class = CondutorSerializer
    permission_classes = [IsAuthenticated, FrotaPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        secretaria = self.request.query_params.get("secretaria")
        if secretaria:
            queryset = queryset.filter(secretaria_id=secretaria)
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
            Lotacao.objects.filter(condutor=condutor, data__lte=target_date)
            .order_by("-data", "-id")
            .first()
        )

        if not lotacao:
            return Response({"lotacao": None})

        return Response({"lotacao": LotacaoSerializer(lotacao).data})


class LotacaoViewSet(ModelViewSet):
    queryset = Lotacao.objects.all()
    serializer_class = LotacaoSerializer
    permission_classes = [IsAuthenticated, FrotaPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        condutor = self.request.query_params.get("condutor")
        if condutor:
            queryset = queryset.filter(condutor_id=condutor)
        return queryset
