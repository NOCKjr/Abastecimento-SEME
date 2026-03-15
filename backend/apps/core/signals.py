from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def seed_on_first_run(sender, **kwargs):
    try:
        from .seed import seed_if_empty

        seed_if_empty(verbosity=0)
    except Exception:
        # Evita derrubar o servidor caso o seed falhe durante o bootstrap.
        # Erros serão visíveis quando rodar o comando `seed` manualmente.
        return

