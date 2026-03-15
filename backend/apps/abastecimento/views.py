import logging
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import GuiaAbastecimento
from .pdf import gerar_pdf_guia
from .serializers import GuiaAbastecimentoSerializer
from apps.usuarios.permissions import GuiaAbastecimentoPermission
from apps.core.viewset_cache import ModelViewSetCacheMixin

logger = logging.getLogger(__name__)


class GuiaAbastecimentoViewSet(ModelViewSetCacheMixin, ModelViewSet):
    queryset = GuiaAbastecimento.objects.all()
    serializer_class = GuiaAbastecimentoSerializer
    permission_classes = [IsAuthenticated, GuiaAbastecimentoPermission]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=["get"])
    def pdf(self, request, pk=None):
        try:
            pdf_bytes = gerar_pdf_guia(pk)
            response = HttpResponse(pdf_bytes, content_type="application/pdf")
            response["Content-Disposition"] = f'attachment; filename="guia_abastecimento_{pk}.pdf"'
            return response
        except ValueError:
            return Response(
                {"detail": "Guia não encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception:
            logger.exception("Erro ao gerar PDF da guia %s", pk)
            return Response(
                {"detail": "Erro interno ao gerar PDF."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
