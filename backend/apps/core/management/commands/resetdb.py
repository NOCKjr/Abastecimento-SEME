import os

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.conf import settings

from apps.core.seed import seed_force


class Command(BaseCommand):
    help = "Apaga todos os dados do banco e recarrega dados padrão (fixtures)."

    def handle(self, *args, **options):
        verbosity = int(options.get("verbosity", 1))

        engine = settings.DATABASES["default"]["ENGINE"]

        if engine.endswith("sqlite3"):
            db_name = os.fspath(settings.DATABASES["default"]["NAME"])
            if os.path.exists(db_name):
                os.remove(db_name)
            call_command("migrate", verbosity=verbosity)
        else:
            call_command("flush", interactive=False, verbosity=verbosity)
            call_command("migrate", verbosity=verbosity)

        seed_force(verbosity=verbosity)

        self.stdout.write(self.style.SUCCESS("Banco resetado e seed carregado."))
