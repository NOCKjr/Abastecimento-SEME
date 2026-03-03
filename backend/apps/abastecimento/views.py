from django.shortcuts import render
from rest_framework import viewsets
from .models import Abastecimento
from .serializers import AbastecimentoSerializer

class AbastecimentoViewSet(viewsets.ModelViewSet):
    queryset = Abastecimento.objects.all().order_by("-data")
    serializer_class = AbastecimentoSerializer