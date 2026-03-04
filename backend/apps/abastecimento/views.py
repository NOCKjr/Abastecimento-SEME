from rest_framework.viewsets import ModelViewSet
from .models import GuiaAbastecimento
from .serializers import GuiaAbastecimentoSerializer


class GuiaAbastecimentoViewSet(ModelViewSet):
    queryset = GuiaAbastecimento.objects.all()
    serializer_class = GuiaAbastecimentoSerializer