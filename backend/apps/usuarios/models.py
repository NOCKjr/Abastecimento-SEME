from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    cpf = models.CharField(max_length=11, unique=True)

    def __str__(self):
        return self.get_full_name() or self.username


    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"