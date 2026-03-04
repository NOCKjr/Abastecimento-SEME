from django.db import models


class Secretaria(models.Model):
    nome = models.CharField(max_length=100)
    sigla = models.CharField(max_length=50)

    def __str__(self):
        return self.sigla


class Rota(models.Model):
    descricao = models.CharField(max_length=100)

    def __str__(self):
        return self.descricao


class Instituicao(models.Model):
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=100)

    rota = models.ForeignKey(
        Rota,
        on_delete=models.CASCADE,
        related_name="instituicoes"
    )

    secretaria = models.ForeignKey(
        Secretaria,
        on_delete=models.CASCADE,
        related_name="instituicoes"
    )

    def __str__(self):
        return self.nome