from django.core.management import call_command
from django.core.management.base import BaseCommand

from apps.core.seed import seed_force


class Command(BaseCommand):
    help = "Apaga todos os dados do banco e recarrega dados padrão (fixtures)."

    def handle(self, *args, **options):
        verbosity = int(options.get("verbosity", 1))

        call_command("flush", interactive=False, verbosity=verbosity)
        seed_force(verbosity=verbosity)

        self.stdout.write(self.style.SUCCESS("Banco resetado e seed carregado."))

