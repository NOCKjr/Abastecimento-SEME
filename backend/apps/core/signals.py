from django.apps import apps
from django.db.models.signals import post_delete, post_migrate, post_save
from django.dispatch import receiver

from .cache import bump_model_cache_version


@receiver(post_migrate)
def seed_on_first_run(sender, **kwargs):
    try:
        from .seed import seed_if_empty

        seed_if_empty(verbosity=0)
    except Exception:
        return


def _invalidate_model_cache(sender, **kwargs):
    try:
        bump_model_cache_version(sender)
    except Exception:
        return


def connect_model_cache_invalidation_signals():
    for model in apps.get_models():
        post_save.connect(_invalidate_model_cache, sender=model, weak=False, dispatch_uid=f"cache_inv_save:{model}")
        post_delete.connect(_invalidate_model_cache, sender=model, weak=False, dispatch_uid=f"cache_inv_del:{model}")

