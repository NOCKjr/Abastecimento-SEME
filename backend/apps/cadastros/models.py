from django.db import models


class Secretaria(models.Model):
    nome = models.CharField(max_length=100)
    sigla = models.CharField(max_length=50)

    def __str__(self):
        return self.sigla

    class Meta:
        verbose_name = "Secretaria"
        verbose_name_plural = "Secretarias"


class Rota(models.Model):
    descricao = models.CharField(max_length=100)

    def __str__(self):
        return self.descricao

    class Meta:
        verbose_name = "Rota"
        verbose_name_plural = "Rotas"


class Instituicao(models.Model):
    TIPO_CHOICES = [
        ('ESCOLA', 'Escola'),
        ('CRECHE', 'Creche'),
        ('UPA', 'UPA'),
        ('HOSPITAL', 'Hospital'),
        ('OUTRO', 'Outro'),
    ]

    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=100, choices=TIPO_CHOICES)

    rota = models.ForeignKey(
        Rota,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="instituicoes"
    )

    secretaria = models.ForeignKey(
        Secretaria,
        on_delete=models.PROTECT,
        related_name="instituicoes"
    )

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Instituição"
        verbose_name_plural = "Instituições"