from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.db import transaction


DEFAULT_SUPERADMIN_CPF = "99999999999"
DEFAULT_SUPERADMIN_PASSWORD = "admin"
DEFAULT_FIXTURE_NAME = "default_data"


@transaction.atomic
def ensure_superadmin(
    cpf: str = DEFAULT_SUPERADMIN_CPF,
    password: str = DEFAULT_SUPERADMIN_PASSWORD,
):
    User = get_user_model()
    if User.objects.filter(cpf=cpf).exists():
        return

    user = User(
        cpf=cpf,
        is_staff=True,
        is_superuser=True,
        first_name="Super",
        last_name="Admin",
        can_write_cadastros=True,
        can_write_frota=True,
        can_create_guia_abastecimento=True,
        can_edit_guia_abastecimento=True,
        can_delete_guia_abastecimento=True,
    )
    user.set_password(password)
    user.save()


def load_default_data(fixture_name: str = DEFAULT_FIXTURE_NAME, verbosity: int = 1):
    call_command("loaddata", fixture_name, verbosity=verbosity)


def seed_if_empty(verbosity: int = 1):
    from apps.cadastros.models import Secretaria

    if Secretaria.objects.exists():
        return False

    ensure_superadmin()
    load_default_data(verbosity=verbosity)
    return True


def seed_force(verbosity: int = 1):
    ensure_superadmin()
    load_default_data(verbosity=verbosity)

