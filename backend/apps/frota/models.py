from django.db import models

from apps.cadastros.models import Rota, Secretaria


class Condutor(models.Model):
    nome_completo = models.CharField(max_length=150)
    cpf = models.CharField(max_length=11)
    ativo = models.BooleanField(default=True)

    secretaria = models.ForeignKey(
        Secretaria,
        on_delete=models.PROTECT,
        related_name="condutores",
    )

    def __str__(self):
        return self.nome_completo

    class Meta:
        verbose_name = "Condutor"
        verbose_name_plural = "Condutores"


class Veiculo(models.Model):
    TIPO_COMBUSTIVEL_CHOICES = [
        ("GASOLINA", "Gasolina"),
        ("DIESEL_S10", "Diesel S10"),
        ("DIESEL", "Diesel Comum"),
        ("ETANOL", "Etanol"),
        ("GNV", "GNV"),
    ]

    placa = models.CharField(max_length=10, unique=True)
    modelo = models.CharField(max_length=100)
    ano = models.IntegerField()
    tipo_combustivel = models.CharField(
        max_length=50,
        choices=TIPO_COMBUSTIVEL_CHOICES,
    )

    secretaria = models.ForeignKey(
        Secretaria,
        on_delete=models.PROTECT,
        related_name="veiculos",
    )

    def __str__(self):
        return self.placa

    class Meta:
        verbose_name = "Veículo"
        verbose_name_plural = "Veículos"


class Lotacao(models.Model):
    data = models.DateField()
    ativa = models.BooleanField(default=True)

    condutor = models.ForeignKey(
        Condutor,
        on_delete=models.PROTECT,
        related_name="lotacoes",
    )

    rota = models.ForeignKey(
        Rota,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="lotacoes",
    )

    veiculo = models.ForeignKey(
        Veiculo,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="lotacoes",
    )

    def __str__(self):
        return f"{self.condutor} - {self.data}"

    class Meta:
        verbose_name = "Lotação"
        verbose_name_plural = "Lotações"
        ordering = ["-data", "-id"]
        constraints = [
            models.UniqueConstraint(
                fields=["condutor", "data"],
                name="unique_lotacao_por_condutor_e_data",
            ),
        ]

