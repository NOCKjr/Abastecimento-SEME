from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Este manager é necessário para o Django saber lidar com o CPF (no createsuperuser)
class UsuarioManager(BaseUserManager):
    def create_user(self, cpf, password=None, **extra_fields):
        if not cpf:
            raise ValueError('O CPF é obrigatório')
        user = self.model(cpf=cpf, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, cpf, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(cpf, password, **extra_fields)

class Usuario(AbstractUser):
    username = None
    cpf = models.CharField(max_length=11, unique=True)

    can_write_cadastros = models.BooleanField(default=False)
    can_write_frota = models.BooleanField(default=False)

    can_create_guia_abastecimento = models.BooleanField(default=True)
    can_edit_guia_abastecimento = models.BooleanField(default=False)
    can_delete_guia_abastecimento = models.BooleanField(default=False)

    USERNAME_FIELD = 'cpf' 
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    # Vincula o manager acima ao modelo
    objects = UsuarioManager()

    def __str__(self):
        return self.get_full_name() or self.cpf

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
