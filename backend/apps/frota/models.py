from django.db import models
from apps.cadastros.models import Secretaria


class Condutor(models.Model):
    nome_completo = models.CharField(max_length=150)
    cpf = models.CharField(max_length=11)

    secretaria = models.ForeignKey(
        Secretaria,
        on_delete=models.CASCADE,
        related_name="condutores"
    )

    def __str__(self):
        return self.nome_completo


class Veiculo(models.Model):
    placa = models.CharField(max_length=10, unique=True)
    modelo = models.CharField(max_length=100)
    ano = models.IntegerField()
    tipo_combustivel = models.CharField(max_length=50)

    secretaria = models.ForeignKey(
        Secretaria,
        on_delete=models.CASCADE,
        related_name="veiculos"
    )

    def __str__(self):
        return self.placa