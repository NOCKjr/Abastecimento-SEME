from django.core.management.base import BaseCommand

from apps.core.seed import seed_force, seed_if_empty


class Command(BaseCommand):
    help = "Carrega dados padrão (fixtures) e garante existência do superadmin."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Carrega fixtures mesmo se já houver dados.",
        )

    def handle(self, *args, **options):
        verbosity = int(options.get("verbosity", 1))
        force = bool(options.get("force"))

        if force:
            seed_force(verbosity=verbosity)
            self.stdout.write(self.style.SUCCESS("Seed carregado (force)."))
            return

        changed = seed_if_empty(verbosity=verbosity)
        if changed:
            self.stdout.write(self.style.SUCCESS("Seed carregado (banco vazio)."))
        else:
            self.stdout.write("Seed ignorado (já existem dados).")

