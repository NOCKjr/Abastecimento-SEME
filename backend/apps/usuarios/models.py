from django.db import models


class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=11, unique=True)
    senha = models.CharField(max_length=128)

    def __str__(self):
        return self.nome