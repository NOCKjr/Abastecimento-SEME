from django.core.management import call_command
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission
from rest_framework.response import Response

from .seed import seed_force


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "is_superuser", False)
        )


@api_view(["POST"])
@permission_classes([IsSuperAdmin])
def seed_default_data_force(request):
    seed_force(verbosity=0)
    return Response({"detail": "Seed carregado (force)."})


@api_view(["POST"])
@permission_classes([IsSuperAdmin])
def reset_db_and_seed_default_data(request):
    call_command("flush", interactive=False, verbosity=0)
    call_command("migrate", verbosity=0)
    seed_force(verbosity=0)
    return Response({"detail": "Banco resetado e seed carregado."})

