from django.db import models
from apps.frota.models import Condutor, Veiculo
from apps.cadastros.models import Secretaria, Rota, Instituicao
from apps.usuarios.models import Usuario


class GuiaAbastecimento(models.Model):
    TIPO_SERVICO_CHOICES = [
        ('CAMINHONETE', 'Caminhonete'),
        ('ONIBUS', 'Ônibus'),
        ('ROCAGEM', 'Roçagem'),
        ('MOTOCICLETA', 'Motocicleta'),
        ('BARQUEIRO', 'Barqueiro'),
    ]

    TIPO_COMBUSTIVEL_CHOICES = [
        ('GASOLINA', 'Gasolina'),
        ('DIESEL_S10', 'Diesel S10'),
        ('DIESEL', 'Diesel Comum'),
        ('ETANOL', 'Etanol'),
        ('GNV', 'GNV'),
    ]

    data_emissao = models.DateField()
    tipo_servico = models.CharField(
        max_length=100,
        choices=TIPO_SERVICO_CHOICES
    )
    tipo_combustivel = models.CharField(
        max_length=50,
        choices=TIPO_COMBUSTIVEL_CHOICES
    )

    qtd_combustivel = models.DecimalField(max_digits=8, decimal_places=3)
    qtd_oleo_lubrificante = models.DecimalField(
        max_digits=8,
        decimal_places=3,
        null=True,
        blank=True
    )

    hodometro = models.IntegerField(null=True, blank=True)
    observacao = models.TextField(blank=True)

    # ForeignKeys obrigatórias com PROTECT
    condutor = models.ForeignKey(
        Condutor,
        on_delete=models.PROTECT,
        related_name="guias"
    )
    instituicao = models.ForeignKey(
        Instituicao,
        on_delete=models.PROTECT,
        related_name="guias"
    )
    secretaria = models.ForeignKey(
        Secretaria,
        on_delete=models.PROTECT,
        related_name="guias"
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        related_name="guias"
    )

    # ForeignKeys opcionais com SET_NULL
    rota = models.ForeignKey(
        Rota,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="guias"
    )
    veiculo = models.ForeignKey(
        Veiculo,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="guias"
    )

    def __str__(self):
        return f"Guia {self.id} - {self.data_emissao.strftime('%d/%m/%Y')}"

    class Meta:
        verbose_name = "Guia de Abastecimento"
        verbose_name_plural = "Guias de Abastecimento"
        ordering = ['-data_emissao']